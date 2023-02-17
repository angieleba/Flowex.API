import BigNumber from "bignumber.js";

export function convertGuidToInt(id : string) {
    // remove the dashes from the given uuid and convert to a hexadecimal BigNumber object
    const bn = new BigNumber(id.replace(/-/g, ''), 16);
    // return the string representation of the BigNumber object as a decimal
    return bn;
};