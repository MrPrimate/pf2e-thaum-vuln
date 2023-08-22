import {
  MORTAL_WEAKNESS_EFFECT_SOURCEID,
  PERSONAL_ANTITHESIS_EFFECT_SOURCEID,
  BREACHED_DEFENSES_EFFECT_SOURCEID,
} from "./utils/index.js";

import { updateEVEffect } from "./socket.js";

import { getActorEVEffect } from "./utils/helpers.js";

import { removeEWOption } from "./feats/esotericWarden.js";

import { createChatCardButton } from "./utils/chatCard.js";

import { manageImplements, clearImplements } from "./implements/implements.js";

//This is a temporary fix until a later pf2e system update. The function hooks on renderChatMessage attack-rolls
//If the thaumaturge makes an attack-roll, the target's weakness updates with the correct amount
//If it's not the thaumaturge that makes the attack-roll, it changes the weakness to 0
Hooks.on(
  "renderChatMessage",
  async (message, html) => {
    if (canvas.initialized) {
      const speaker = await fromUuid(`Actor.${message.speaker.actor}`);
      if (
        (message.flags?.pf2e?.context?.type === "attack-roll" ||
          message.flags?.pf2e?.context?.type === "spell-attack-roll" ||
          message.flags?.pf2e?.context?.type === "saving-throw") &&
        speaker.isOwner
      ) {
        const targs = message.getFlag("pf2e-thaum-vuln", "targets");
        let damageType;
        let effValue;

        for (let targ of targs) {
          if (targ.actorUuid) {
            targ = await fromUuid(targ.actorUuid);

            if (
              !targ.items.some((i) =>
                i.getFlag("pf2e-thaum-vuln", "EffectOrigin")
              )
            ) {
              return;
            }

            const effectOrigin = speaker.getFlag(
              "pf2e-thaum-vuln",
              "effectSource"
            )
              ? await fromUuid(
                  speaker.getFlag("pf2e-thaum-vuln", "effectSource")
                )
              : await fromUuid(
                  targ.items
                    .find((i) => i.getFlag("pf2e-thaum-vuln", "EffectOrigin"))
                    .getFlag("pf2e-thaum-vuln", "EffectOrigin")
                );

            const targEffect = getActorEVEffect(
              targ.actor ?? targ,
              effectOrigin?.uuid ?? speaker.uuid
            ).map((i) => (i = i.uuid));

            if (
              speaker.getFlag("pf2e-thaum-vuln", "effectSource") ===
              targ.items
                .find((i) => i.getFlag("pf2e-thaum-vuln", "EffectOrigin"))
                .getFlag("pf2e-thaum-vuln", "EffectOrigin")
            ) {
              effValue = speaker.getFlag("pf2e-thaum-vuln", "EVValue") ?? 0;
            } else {
              effValue = 0;
            }

            if (
              message.flags?.pf2e?.context?.type === "spell-attack-roll" ||
              (message.flags?.pf2e?.context?.type === "saving-throw" &&
                message.flags?.pf2e?.origin?.type === "spell")
            ) {
              damageType = "physical";
              effValue = 0;
            } else {
              const strike = message.item.system;
              if (strike.damage) {
                if (message._strike.versatileOptions.length != 0) {
                  damageType = message._strike.versatileOptions.find(
                    (o) => o.selected === true
                  ).value;
                } else {
                  damageType = strike.damage.damageType;
                }
              } else if (strike.damageRolls) {
                damageType =
                  strike.damageRolls[Object.keys(strike.damageRolls)[0]]
                    .damageType;
              }

              if (
                damageType === "untyped" ||
                damageType === undefined ||
                damageType === null
              ) {
                damageType = "physical";
                console.warn(
                  "[PF2E Exploit Vulnerability] - Unable to determine damageType of " +
                    strike.name +
                    ". Defaulting to Physical."
                );
              }
            }
            updateEVEffect(targ.uuid, targEffect, effValue, damageType);
          }
        }
        handleEsotericWarden(message);
      }
    }

    createChatCardButton(message, html);
  },
  { once: false }
);

async function handleEsotericWarden(message) {
  const speakerToken = await fromUuid(
    `Scene.${message.speaker.scene}.Token.${message.speaker.token}`
  );

  for (let target of message.getFlag("pf2e-thaum-vuln", "targets")) {
    target = await fromUuid(target.actorUuid);
    let EWEffect = target?.items?.find(
      (item) => item.slug === "esoteric-warden-effect"
    );

    if (
      EWEffect &&
      target
        .getFlag("pf2e-thaum-vuln", "EVTargetID")
        .includes(speakerToken.uuid) &&
      (message.flags?.pf2e?.context?.type === "attack-roll" ||
        message.flags?.pf2e?.context?.type === "spell-attack-roll")
    ) {
      removeEWOption(EWEffect, target, "ac");
    }
  }
  if (
    message.flags?.pf2e?.context?.type === "saving-throw" &&
    message
      .getFlag("pf2e", "modifiers")
      .some((i) => i.slug === "esoteric-warden-save")
  ) {
    let EWEffect = speakerToken?.actor?.items?.find(
      (item) => item.slug === "esoteric-warden-effect"
    );
    if (EWEffect) {
      removeEWOption(EWEffect, speakerToken.actor, "save");
    }
  }
}

//adds a target flag to the chat message. Borrowed from pf2e-target-damage https://github.com/MrVauxs/PF2e-Target-Damage
Hooks.on("preCreateChatMessage", (message) => {
  if (message.rolls[0]?.options.evaluatePersistent) {
    message.updateSource({
      "flags.pf2e-thaum-vuln.targets": [message.token.object].map((target) => {
        return {
          id: target.id,
          tokenUuid: target.document.uuid,
          actorUuid: target.actor.uuid,
        };
      }),
    });
  } else {
    message.updateSource({
      "flags.pf2e-thaum-vuln.targets": Array.from(game.user.targets).map(
        (target) => {
          return {
            id: target.id,
            tokenUuid: target.document.uuid,
            actorUuid: target.actor.uuid,
          };
        }
      ),
    });
  }
});

//resets the Esoteric Warden immune targets when resting for the night
Hooks.on("pf2e.restForTheNight", (actor) => {
  actor.unsetFlag("pf2e-thaum-vuln", "EWImmuneTargs");
});

//sets pertinent flags when one of the Exploit Vulnerability effects are deleted
Hooks.on("deleteItem", async (item) => {
  const sa = item.parent;
  if (
    item.sourceId === MORTAL_WEAKNESS_EFFECT_SOURCEID ||
    item.sourceId === PERSONAL_ANTITHESIS_EFFECT_SOURCEID ||
    item.sourceId === BREACHED_DEFENSES_EFFECT_SOURCEID
  ) {
    await sa.setFlag("pf2e-thaum-vuln", "activeEV", false);
    await sa.unsetFlag("pf2e-thaum-vuln", "EVTargetID");
    await sa.unsetFlag("pf2e-thaum-vuln", "EVMode");
    await sa.unsetFlag("pf2e-thaum-vuln", "EVValue");
    await sa.unsetFlag("pf2e-thaum-vuln", "primaryEVTarget");
    await sa.unsetFlag("pf2e-thaum-vuln", "effectSource");
  }
});

Hooks.on("renderCharacterSheetPF2e", async (_sheet, html) => {
  const a = _sheet.actor;
  if (!a.getFlag("pf2e-thaum-vuln", "selectedImplements"))
    a.setFlag("pf2e-thaum-vuln", "selectedImplements", new Array(3));
  if (a.items.some((i) => i.slug === "first-implement-and-esoterica")) {
    const inventoryList = html.find(
      ".sheet-body .inventory-list.directory-list.inventory-pane"
    );
    const implementButtonRegion = $(
      `<div class="implement-button-region" style="display:flex"></div>`
    );
    const manageImplementButton = $(
      `<button type="button" class="manage-implements-button">Manage Implements</button>`
    );
    const clearImplementButton = $(
      `<button type="button" class="clear-implements-button">Clear All Implements</button>`
    );
    inventoryList.append(
      `<div class="inventory-header">
    <h3 class="item-name">Thaumaturge Implements</h3></div>
    
    `
    );

    showImplementsOnSheet(inventoryList, a);

    implementButtonRegion.append(manageImplementButton);
    implementButtonRegion.append(clearImplementButton);
    inventoryList.append(implementButtonRegion);
    $(manageImplementButton).click({ actor: a }, function (event) {
      manageImplements(event);
    });
    $(clearImplementButton).click({ actor: a }, function (event) {
      clearImplements(event);
    });
  }
});

function showImplementsOnSheet(inventoryList, a) {
  if (a.getFlag("pf2e-thaum-vuln", "selectedImplements") !== undefined) {
    for (const imp of a.getFlag("pf2e-thaum-vuln", "selectedImplements")) {
      const id = `[data-item-id="${imp?.uuid.split(".")[3]}`;
      const inventoryItem = $(inventoryList).find($(".item")).filter($(id));

      $(inventoryItem)
        .find("div.item-name.rollable")
        .append(
          $(
            `<img class="item-image item-icon" title="${imp?.counter} implement" style="border-width: 0px; margin-left: 10px;" src="/modules/pf2e-thaum-vuln/assets/chosen-implement.webp" />`
          )
        );
    }
  }
}
