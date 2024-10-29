# Navodila za zagon skripte

To skripto lahko zaženete z uporabo `npx` in `ts-node`. Skripta prenese podatke iz API-ja in ustvari/uredi PDF dokument na podlagi teh podatkov.

## Zahteve

- Nameščeni morate imeti Node.js.
- Za uporabo te skripte potrebujete paket `ts-node`.

## Namestitev

1. Najprej namestite `ts-node`, če ga še nimate:
    ```bash
    npm install -g ts-node
    ```

2. Nato zaženite skripto s pomočjo `npx`:
    ```bash
    npx ts-node test.ts
    ```

## Kaj počne skripta

Skripta prenese PDF datoteko in jo uredi na podlagi podatkov iz API-ja. Končni PDF bo shranjen v datoteko `modified_output.pdf`.
To je preprost primer za delo s PDF-ji in podatki iz API-ja s pomočjo `pdf-lib` in `node-fetch`.
