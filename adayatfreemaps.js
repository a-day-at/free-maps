Hooks.once("ready", async function () {
    if (!game.user.isGM) return;

    const MODULE_NAMESPACE = "a-day-at-free-maps";
    const FLAG_NAME = "welcome";
    const WELCOME_JOURNAL_NAME = "Welcome to a day at maps & assets";
    const COMPENDIUM_NAME = `${MODULE_NAMESPACE}.a-day-at-free-maps-journal`;

    // Register API globally so other modules or macros can call it
    game.modules.get(MODULE_NAMESPACE).api = {
        resetWelcomeFlag
    };
    console.log(`[${MODULE_NAMESPACE}] API registered.`);

    await game.settings.ready;

    let hasSeenWelcome = await game.user.getFlag(MODULE_NAMESPACE, FLAG_NAME);

    if (!hasSeenWelcome) {
        console.log(`[${MODULE_NAMESPACE}] Showing Welcome Journal...`);

        let journal = await findJournalInCompendium(COMPENDIUM_NAME, WELCOME_JOURNAL_NAME);

        if (journal) {
            journal.sheet.render(true);
            await game.user.setFlag(MODULE_NAMESPACE, FLAG_NAME, true);
            console.log(`[${MODULE_NAMESPACE}] Welcome Journal flag set to true.`);
        } else {
            console.warn(`[${MODULE_NAMESPACE}] Welcome journal not found in compendium.`);
        }
    }
});

/**
 * Reset the welcome flag by setting it to `false` so the journal can be shown again.
 */
async function resetWelcomeFlag() {
    if (!game.user.isGM) return;

    const MODULE_NAMESPACE = "a-day-at-free-maps";
    const FLAG_NAME = "welcome";

    await game.user.setFlag(MODULE_NAMESPACE, FLAG_NAME, false);
    console.log(`[${MODULE_NAMESPACE}] Welcome flag set to false for GM.`);
}

/**
 * Finds a journal entry inside a compendium without importing it.
 * @param {string} compendiumKey - The full compendium key (e.g., "a-day-at-free-maps.a-day-at-free-maps-journal").
 * @param {string} journalName - The name of the journal entry.
 * @returns {Promise<JournalEntry|null>}
 */
async function findJournalInCompendium(compendiumKey, journalName) {
    const pack = game.packs.get(compendiumKey);
    if (!pack) {
        console.warn(`[a-day-at-free-maps] Compendium '${compendiumKey}' not found.`);
        return null;
    }

    const documents = await pack.getDocuments();
    return documents.find(j => j.name === journalName) || null;
}