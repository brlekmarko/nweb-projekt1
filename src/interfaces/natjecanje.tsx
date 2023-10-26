export interface NatjecanjeForma {
    naziv: string;
    natjecatelji: string[];
    bodoviPobjeda: number;
    bodoviPoraz: number;
    bodoviNerjeseno: number;
    kreator: string;
}

export interface Natjecatelj{
    idnatjecatelj: number;
    idnatjecanje: number;
    ime: string;
    bodovi: number;
}

export interface Igra{
    idigra: number;
    idnatjecatelj: number;
    igracdvaidnatjecatelj: number;
    pobjednik: string;
}

export interface Natjecanje {
    idnatjecanje: number;
    naziv: string;
    bodovipobjeda: number;
    bodoviporaz: number;
    bodovinerjeseno: number;
    kreator: string;
    natjecatelji: Natjecatelj[];
    igre: Igra[];
}