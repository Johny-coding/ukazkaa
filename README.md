# Moje Sámoška — GitHub Pages demo

Kořenový `index.html` je samostatná statická verze webu: nevyžaduje Next.js build, složky ani instalaci balíčků. Obsahuje katalog, filtrování, akční nabídku a správu produktů. Ve veřejné navigaci není odkaz na administraci — majitel otevře přihlašovací obrazovku zadáním adresy s koncovkou `/admin`.

## Nasazení na GitHub Pages

1. Rozbalte ZIP a nahrajte **jeho obsah** do kořene GitHub repozitáře. Neodesílejte samotný ZIP jako jediný soubor.
2. V repozitáři otevřete **Settings → Pages**.
3. V části **Build and deployment** vyberte **Deploy from a branch**, větev `main` a složku `/(root)`, potom potvrďte **Save**.
4. Po dokončení nasaďte stránku z kořenového `index.html`. Pro neveřejnou administrační URL `/admin` je součástí balíčku také kořenový `404.html`; GitHub Pages použije vlastní 404 stránku a ukáže přihlašovací okno na zadané cestě.

Pro statickou ukázku není potřeba spouštět `npm install`, nastavovat GitHub Actions ani připojovat databázi.

## Vstup majitele

Otevřete adresu svého webu a doplňte `/admin`, například `https://uzivatel.github.io/nazev-repozitare/admin`.

- **Jméno:** `admin`
- **Heslo:** `admin`

Na veřejném webu není tlačítko do administrace. V administraci lze produkty přidávat, upravovat a mazat; katalog, akce i stav skladu se hned aktualizují. Demo ukládá změny do místního úložiště konkrétního prohlížeče (`localStorage`), ne do sdílené databáze. Mock přihlášení není produkční zabezpečení.

## Next.js zdrojový kód

V kořeni zůstávají také zdrojové soubory pro Next.js App Router. Pokud chcete spustit tuto variantu lokálně:

```bash
npm ci
npm run dev
```

`prepare.mjs` před spuštěním vytvoří požadované adresáře `app/`, `lib/` a `supabase/`. Next.js varianta také přesměruje `/admin` na demo přihlášení. GitHub Pages však Node.js nespouští — pro GitHub Pages se používá samostatný `index.html` a `404.html`.
