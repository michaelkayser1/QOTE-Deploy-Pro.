// Sample glyph text to prefill the textarea
const sampleGlyphs = `👥 ⭐ 🔲 🏛️ 👥👥👥
🌊 ━ ⚪⚪⚪ 🪞🪞 ⏸️ ➡️ 👥⭐
👁️📐 👁️📐 👁️📐 🔬🔬 🦁👤👤🐕
🏠🌉 🌉🏠 📦📦📦 👤➡️📦➡️👤
🔧🐄 🌾 🪨🌍 🛠️🐐`;

// Row decode mappings
const rowDecodes = {
    1: `The corridor opens.
A small group steps out of the dark into a star field.
They find a grid and build an archway.
At the end of the corridor, more people are waiting.`,

    2: `Light remembers how to move.
The river starts as a line, breaks into orbs, passes mirrors,
rests for a moment, then continues toward a gathered group under a star.`,

    3: `The watchers and the instruments.
Eyes on tripods watch the corridor.
Instruments hang over the path.
Animals and humans move together under surveillance.`,

    4: `Bridges, boxes, and servers.
Shelters and bridges keep appearing over the path.
The path breaks into boxes – modules, rooms, nodes.
People keep walking through the modular maze.`,

    5: `Return to the ground.
After all the stars, grids, and boxes,
it ends with simple tools and animals on the ground.
The field remembers it is still earth.`
};

/**
 * Get the decode text for a specific row index
 * @param {number} rowIndex - The row number (1-based)
 * @returns {string} - The decoded text for that row
 */
function getDecodeForRow(rowIndex) {
    if (rowIndex >= 1 && rowIndex <= 5) {
        return rowDecodes[rowIndex];
    }
    return "This row continues the corridor, extending the pattern into new territory.";
}

/**
 * Render the decoded output for all glyph lines
 * @param {string[]} lines - Array of glyph text lines
 */
function renderDecodes(lines) {
    const outputContainer = document.getElementById('decodeOutput');

    // Clear previous output
    outputContainer.innerHTML = '';

    // Filter out empty lines and process each line
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);

    if (nonEmptyLines.length === 0) {
        outputContainer.innerHTML = '<p style="color: #6b7b8c; font-style: italic;">No glyph lines to decode. Paste some symbols to begin.</p>';
        return;
    }

    nonEmptyLines.forEach((line, index) => {
        const rowIndex = index + 1;
        const decodeText = getDecodeForRow(rowIndex);

        // Create card element
        const card = document.createElement('div');
        card.className = 'decode-card';

        // Create and append row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = `Row ${rowIndex}`;
        card.appendChild(rowLabel);

        // Create and append glyph line
        const glyphLine = document.createElement('div');
        glyphLine.className = 'glyph-line';
        glyphLine.textContent = line;
        card.appendChild(glyphLine);

        // Create and append decode text
        const decodeTextEl = document.createElement('div');
        decodeTextEl.className = 'decode-text';
        decodeTextEl.textContent = decodeText;
        card.appendChild(decodeTextEl);

        // Add card to output container
        outputContainer.appendChild(card);
    });
}

/**
 * Handle the decode button click
 */
function handleDecode() {
    const textarea = document.getElementById('glyphInput');
    const inputText = textarea.value;
    const lines = inputText.split('\n');
    renderDecodes(lines);
}

/**
 * Initialize the app on page load
 */
function init() {
    const textarea = document.getElementById('glyphInput');
    const decodeButton = document.getElementById('decodeButton');

    // Prefill with sample glyphs
    textarea.value = sampleGlyphs;

    // Initial decode of sample data
    handleDecode();

    // Add event listener to decode button
    decodeButton.addEventListener('click', handleDecode);

    // Optional: Auto-decode on input change (with debounce for performance)
    let debounceTimer;
    textarea.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(handleDecode, 500);
    });
}

// Run init when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
