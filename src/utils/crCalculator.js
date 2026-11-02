// D&D 5e DMG p. 274 - Monster Statistics by Challenge Rating
export const CR_TABLE = [
    { cr: "0",   num: 0,     xp: 10,     prof: 2, ac: 13, hpMin: 1,   hpMax: 6,   atk: 3,  dprMin: 0,   dprMax: 1,   dc: 13 },
    { cr: "1/8", num: 0.125, xp: 25,     prof: 2, ac: 13, hpMin: 7,   hpMax: 35,  atk: 3,  dprMin: 2,   dprMax: 3,   dc: 13 },
    { cr: "1/4", num: 0.25,  xp: 50,     prof: 2, ac: 13, hpMin: 36,  hpMax: 49,  atk: 3,  dprMin: 4,   dprMax: 5,   dc: 13 },
    { cr: "1/2", num: 0.5,   xp: 100,    prof: 2, ac: 13, hpMin: 50,  hpMax: 70,  atk: 3,  dprMin: 6,   dprMax: 8,   dc: 13 },
    { cr: "1",   num: 1,     xp: 200,    prof: 2, ac: 13, hpMin: 71,  hpMax: 85,  atk: 3,  dprMin: 9,   dprMax: 14,  dc: 13 },
    { cr: "2",   num: 2,     xp: 450,    prof: 2, ac: 13, hpMin: 86,  hpMax: 100, atk: 3,  dprMin: 15,  dprMax: 20,  dc: 13 },
    { cr: "3",   num: 3,     xp: 700,    prof: 2, ac: 13, hpMin: 101, hpMax: 115, atk: 4,  dprMin: 21,  dprMax: 26,  dc: 13 },
    { cr: "4",   num: 4,     xp: 1100,   prof: 2, ac: 14, hpMin: 116, hpMax: 130, atk: 5,  dprMin: 27,  dprMax: 32,  dc: 14 },
    { cr: "5",   num: 5,     xp: 1800,   prof: 3, ac: 15, hpMin: 131, hpMax: 145, atk: 6,  dprMin: 33,  dprMax: 38,  dc: 15 },
    { cr: "6",   num: 6,     xp: 2300,   prof: 3, ac: 15, hpMin: 146, hpMax: 160, atk: 6,  dprMin: 39,  dprMax: 44,  dc: 15 },
    { cr: "7",   num: 7,     xp: 2900,   prof: 3, ac: 15, hpMin: 161, hpMax: 175, atk: 6,  dprMin: 45,  dprMax: 50,  dc: 15 },
    { cr: "8",   num: 8,     xp: 3900,   prof: 3, ac: 16, hpMin: 176, hpMax: 190, atk: 7,  dprMin: 51,  dprMax: 56,  dc: 16 },
    { cr: "9",   num: 9,     xp: 5000,   prof: 4, ac: 16, hpMin: 191, hpMax: 205, atk: 7,  dprMin: 57,  dprMax: 62,  dc: 16 },
    { cr: "10",  num: 10,    xp: 5900,   prof: 4, ac: 17, hpMin: 206, hpMax: 220, atk: 7,  dprMin: 63,  dprMax: 68,  dc: 16 },
    { cr: "11",  num: 11,    xp: 7200,   prof: 4, ac: 17, hpMin: 221, hpMax: 235, atk: 8,  dprMin: 69,  dprMax: 74,  dc: 17 },
    { cr: "12",  num: 12,    xp: 8400,   prof: 4, ac: 17, hpMin: 236, hpMax: 250, atk: 8,  dprMin: 75,  dprMax: 80,  dc: 17 },
    { cr: "13",  num: 13,    xp: 10000,  prof: 5, ac: 18, hpMin: 251, hpMax: 265, atk: 8,  dprMin: 81,  dprMax: 86,  dc: 18 },
    { cr: "14",  num: 14,    xp: 11500,  prof: 5, ac: 18, hpMin: 266, hpMax: 280, atk: 8,  dprMin: 87,  dprMax: 92,  dc: 18 },
    { cr: "15",  num: 15,    xp: 13000,  prof: 5, ac: 18, hpMin: 281, hpMax: 295, atk: 8,  dprMin: 93,  dprMax: 98,  dc: 18 },
    { cr: "16",  num: 16,    xp: 15000,  prof: 5, ac: 18, hpMin: 296, hpMax: 310, atk: 9,  dprMin: 99,  dprMax: 104, dc: 18 },
    { cr: "17",  num: 17,    xp: 18000,  prof: 6, ac: 19, hpMin: 311, hpMax: 325, atk: 10, dprMin: 105, dprMax: 110, dc: 19 },
    { cr: "18",  num: 18,    xp: 20000,  prof: 6, ac: 19, hpMin: 326, hpMax: 340, atk: 10, dprMin: 111, dprMax: 116, dc: 19 },
    { cr: "19",  num: 19,    xp: 22000,  prof: 6, ac: 19, hpMin: 341, hpMax: 355, atk: 10, dprMin: 117, dprMax: 122, dc: 19 },
    { cr: "20",  num: 20,    xp: 25000,  prof: 6, ac: 19, hpMin: 356, hpMax: 400, atk: 10, dprMin: 123, dprMax: 140, dc: 19 },
    { cr: "21",  num: 21,    xp: 33000,  prof: 7, ac: 19, hpMin: 401, hpMax: 445, atk: 11, dprMin: 141, dprMax: 158, dc: 20 },
    { cr: "22",  num: 22,    xp: 41000,  prof: 7, ac: 19, hpMin: 446, hpMax: 490, atk: 11, dprMin: 159, dprMax: 176, dc: 20 },
    { cr: "23",  num: 23,    xp: 50000,  prof: 7, ac: 19, hpMin: 491, hpMax: 535, atk: 11, dprMin: 177, dprMax: 194, dc: 20 },
    { cr: "24",  num: 24,    xp: 62000,  prof: 7, ac: 19, hpMin: 536, hpMax: 580, atk: 12, dprMin: 195, dprMax: 212, dc: 21 },
    { cr: "25",  num: 25,    xp: 75000,  prof: 8, ac: 19, hpMin: 581, hpMax: 625, atk: 12, dprMin: 213, dprMax: 230, dc: 21 },
    { cr: "26",  num: 26,    xp: 90000,  prof: 8, ac: 19, hpMin: 626, hpMax: 670, atk: 12, dprMin: 231, dprMax: 248, dc: 21 },
    { cr: "27",  num: 27,    xp: 105000, prof: 8, ac: 19, hpMin: 671, hpMax: 715, atk: 13, dprMin: 249, dprMax: 266, dc: 22 },
    { cr: "28",  num: 28,    xp: 120000, prof: 8, ac: 19, hpMin: 716, hpMax: 760, atk: 13, dprMin: 267, dprMax: 284, dc: 22 },
    { cr: "29",  num: 29,    xp: 135000, prof: 9, ac: 19, hpMin: 761, hpMax: 805, atk: 13, dprMin: 285, dprMax: 302, dc: 22 },
    { cr: "30",  num: 30,    xp: 155000, prof: 9, ac: 19, hpMin: 806, hpMax: 9999,atk: 14, dprMin: 303, dprMax: 9999,dc: 23 }
];

const clampIndex = (idx) => Math.max(0, Math.min(CR_TABLE.length - 1, idx));

export const calculateMonsterCR = ({
    hp = 10,
    ac = 10,
    dpr = 2,
    attackBonus = 3,
    saveDC = 0,
    useSaveDC = false
}) => {
    const cleanHp = Math.max(1, parseInt(hp) || 1);
    const cleanAc = Math.max(1, parseInt(ac) || 10);
    const cleanDpr = Math.max(0, parseInt(dpr) || 0);
    const cleanAtk = parseInt(attackBonus) || 0;
    const cleanDc = parseInt(saveDC) || 10;

    // 1. Base Defensive CR Index by HP
    let baseDefIdx = CR_TABLE.findIndex(r => cleanHp >= r.hpMin && cleanHp <= r.hpMax);
    if (baseDefIdx === -1) {
        baseDefIdx = cleanHp > 805 ? CR_TABLE.length - 1 : 0;
    }
    const expectedAc = CR_TABLE[baseDefIdx].ac;
    const acDiffSteps = Math.trunc((cleanAc - expectedAc) / 2);
    const finalDefIdx = clampIndex(baseDefIdx + acDiffSteps);

    // 2. Base Offensive CR Index by DPR
    let baseOffIdx = CR_TABLE.findIndex(r => cleanDpr >= r.dprMin && cleanDpr <= r.dprMax);
    if (baseOffIdx === -1) {
        baseOffIdx = cleanDpr > 302 ? CR_TABLE.length - 1 : 0;
    }
    const offDelta = useSaveDC
        ? (cleanDc - CR_TABLE[baseOffIdx].dc)
        : (cleanAtk - CR_TABLE[baseOffIdx].atk);
    const offDiffSteps = Math.trunc(offDelta / 2);
    const finalOffIdx = clampIndex(baseOffIdx + offDiffSteps);

    // 3. Average CR
    const defCRNum = CR_TABLE[finalDefIdx].num;
    const offCRNum = CR_TABLE[finalOffIdx].num;
    const avgNum = (defCRNum + offCRNum) / 2;

    // Find closest entry in CR_TABLE
    let bestIdx = 0;
    let minDiff = Infinity;
    CR_TABLE.forEach((row, idx) => {
        const diff = Math.abs(row.num - avgNum);
        if (diff < minDiff) {
            minDiff = diff;
            bestIdx = idx;
        }
    });

    const finalRow = CR_TABLE[bestIdx];
    return {
        cr: finalRow.cr,
        xp: finalRow.xp,
        proficiencyBonus: finalRow.prof,
        defensiveCR: CR_TABLE[finalDefIdx].cr,
        offensiveCR: CR_TABLE[finalOffIdx].cr
    };
};
