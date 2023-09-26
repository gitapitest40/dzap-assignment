export function validateInputAddresses(address){
    return (/^(0x){1}[0-9a-fA-F]{40}$/i.test(address));
}

export function findDuplicateIndexes(arr) {
    const duplicateMap = {};
    const duplicates = [];
  
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (duplicateMap[item] === undefined) {
        duplicateMap[item] = [i];
      } else {
        duplicateMap[item].push(i);
      }
    }
  
    for (const key in duplicateMap) {
      if (duplicateMap[key].length > 1) {
        duplicates.push({ value: key, indexes: duplicateMap[key] });
      }
    }
  
    return duplicates;
  }