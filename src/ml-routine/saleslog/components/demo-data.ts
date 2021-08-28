export class ItemObj {
    id: string;
    code: string;
    name: string;
    details: StyleDetails;
}
export class StyleDetails {
    background: string;
    color: string;
}

export interface Bank {
    id: string;
    name: string;
}

export interface BankGroup {
    name: string;
    banks: Bank[];
}

/** list of banks */
export const BANKS: Bank[] = [
   
];

/** list of bank groups */
export const BANKGROUPS: BankGroup[] = [];
