const BigNumber = require('bignumber.js');
const { TransactionBlock, ethos } = require('ethos-connect');
const { newMainnetContractAddress } = require('./constants');

const utils = {
  eById: (id) => document.getElementById(id),
  
  eByClass: (className) => document.getElementsByClassName(className),

  toArray: (itemOrItems) => {
    const itemsArray = Array.isArray(itemOrItems) || itemOrItems instanceof HTMLCollection ? 
      itemOrItems : 
      [itemOrItems];
    return itemsArray;
  },

  addClass: (elementOrElements, className) => {
    if (!elementOrElements) return;

    const allElements = utils.toArray(elementOrElements) 
    for (const element of allElements) {
      if (!element) continue;
      element.classList.add(className)
    }
  },

  removeClass: (elementOrElements, classNameOrNames) => {
    if (!elementOrElements) return;

    const allClassNames = utils.toArray(classNameOrNames) 
    const allElements = utils.toArray(elementOrElements) 
    for (const element of allElements) {
      if (!element) continue;

      element.classList.remove(...allClassNames)
    }
  },

  setOnClick: (elementOrElements, onClick) => {
    if (!elementOrElements) return;

    const allElements = utils.toArray(elementOrElements) 
    for (const element of allElements) {
      if (!element) continue;

      element.onclick = onClick;
    }
  },

  directionNumberToDirection: (directionNumber) => {
    switch(directionNumber) {
      case "0": return "left";
      case "1": return "right";
      case "2": return "up";
      case "3": return "down";
    }
  },

  directionToDirectionNumber: (direction) => {
    switch(direction) {
      case "left": return "0";
      case "right": return "1";
      case "up": return "2";
      case "down": return "3";
    }
  },

  directionNumberToSymbol: (directionNumber) => {
    switch(directionNumber) {
      case "0": return "←";
      case "1": return "→";
      case "2": return "↑";
      case "3": return "↓";
    }
  },

  isVertical: (direction) => ["up", "down"].includes(direction),

  isReverse: (direction) => ["right", "down"].includes(direction),

  truncateMiddle: (s, length=6) => `${s.slice(0,length)}...${s.slice(length * -1)}`,

  formatBalance: (balance, decimals) => {
    if (!balance) return '---';
    
    let postfix = '';
    let bn = new BigNumber(balance.toString()).shiftedBy(-1 * decimals);

    if (bn.gte(1_000_000_000)) {
        bn = bn.shiftedBy(-9);
        postfix = ' B';
    } else if (bn.gte(1_000_000)) {
        bn = bn.shiftedBy(-6);
        postfix = ' M';
    } else if (bn.gte(10_000)) {
        bn = bn.shiftedBy(-3);
        postfix = ' K';
    }

    return bn.decimalPlaces(3, BigNumber.ROUND_DOWN).toFormat() + postfix;
  },

  getAllCheckedGames: () => {
    return document.querySelectorAll('input[class=select-game-check]:checked')
  },

  burnGames: async (ids, signer, contractAddress) => {
    console.log("Burn", ids)

    const transactionBlock = new TransactionBlock();

    for (const id of ids) {
      transactionBlock.moveCall({
        target: `${newMainnetContractAddress}::game_8192::burn_game`,
        typeArguments: [],
        arguments: [transactionBlock.object(id)]
      })  
    }

    try {
      const data = await ethos.transact({
        signer,
        transactionInput: {
          transactionBlock,
          options: {
            showEvents: true
          },
          requestType: 'WaitForLocalExecution'
        }
      });
      
      console.log("Burn response", data)
    } catch (e) {
      console.log("Burn error", e)
    }
  },

  fixGames: async (ids, signer, contractAddress) => {
    console.log("Fix", ids)

    const transactionBlock = new TransactionBlock();

    for (const id of ids) {
      transactionBlock.moveCall({
        target: `${newMainnetContractAddress}::game_8192::fix_game`,
        typeArguments: [],
        arguments: [transactionBlock.object(id)]
      })  
    }

    try {
      const data = await ethos.transact({
        signer,
        transactionInput: {
          transactionBlock,
          options: {
            showEvents: true
          },
          requestType: 'WaitForLocalExecution'
        }
      });
      
      console.log("Fix response", data)
    } catch (e) {
      console.log("Fix error", e)
    }
  }
}

module.exports = utils;
  