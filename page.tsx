"use client";

import {
  FormEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  CATEGORIES,
  CATEGORY_IMAGES,
  HERO_IMAGE,
  INITIAL_PRODUCTS,
  isProductAvailable,
  type Product,
  type ProductCategory,
  type ProductFormValues,
} from "@/lib/products";

type CategoryFilter = "Vše" | ProductCategory;
type ProductModalState =
  | { kind: "create" }
  | { kind: "edit"; product: Product }
  | null;

type IconName =
  | "leaf"
  | "lock"
  | "arrow"
  | "plus"
  | "edit"
  | "trash"
  | "close"
  | "check"
  | "logout"
  | "bag"
  | "clock"
  | "pin"
  | "star"
  | "info";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "leaf":
      return (
        <svg {...common}>
          <path d="M20.5 3.5C11 3.7 5.1 5.1 4 11.2c-.6 3.2 1.5 5.4 4.4 5.4 6.7 0 10.2-7.5 12.1-13.1Z" />
          <path d="M3.5 21c2.5-5.3 6.2-8.8 11.8-11.6" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4.5" y="10" width="15" height="11" rx="2.5" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <path d="M12 14v3" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "edit":
      return (
        <svg {...common}>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
        </svg>
      );
    case "trash":
      return (
        <svg {...common}>
          <path d="M3.5 6.5h17" />
          <path d="M9 6.5V4h6v2.5" />
          <path d="m6 6.5 1 14h10l1-14" />
          <path d="M10 10v7M14 10v7" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12.5 4.2 4.2L19 7" />
        </svg>
      );
    case "logout":
      return (
        <svg {...common}>
          <path d="M10 17l5-5-5-5" />
          <path d="M15 12H3" />
          <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
        </svg>
      );
    case "bag":
      return (
        <svg {...common}>
          <path d="M5 8h14l1 12H4L5 8Z" />
          <path d="M9 9V6a3 3 0 0 1 6 0v3" />
          <path d="M8 12v.01M16 12v.01" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5" />
          <path d="M12 8h.01" />
        </svg>
      );
  }
}

function formatPrice(price: number) {
  return `${new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }).format(price)} Kč`;
}

function ProductCard({ product }: { product: Product }) {
  const available = isProductAvailable(product);

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <img
          className="product-card__image"
          src={product.image_url || CATEGORY_IMAGES[product.category]}
          alt={product.title}
          loading="lazy"
        />
        {product.is_action && (
          <div className="product-card__labels">
            <span className="sale-badge">
              <Icon name="star" size={11} /> AKCE
            </span>
          </div>
        )}
      </div>
      <div className="product-card__body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">{product.title}</h3>
        <div className="product-card__price-row">
          <div className="product-price">
            {new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 2 }).format(product.price)}
            <small>Kč</small>
          </div>
          <StockBadge product={product} />
        </div>
      </div>
    </article>
  );
}

function StockBadge({ product }: { product: Pick<Product, "in_stock" | "stock_count"> }) {
  if (isProductAvailable(product)) {
    return (
      <span className="stock-badge stock-badge--available">
        <span className="stock-badge__dot" />
        Skladem ({product.stock_count} ks)
      </span>
    );
  }

  return (
    <span className="stock-badge stock-badge--empty">
      <span className="stock-badge__dot" />
      VYPRODÁNO
    </span>
  );
}

function PublicStore({
  products,
  activeCategory,
  onCategoryChange,
}: {
  products: Product[];
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}) {
  const actionProducts = products.filter((product) => product.is_action);
  const visibleProducts =
    activeCategory === "Vše"
      ? products
      : products.filter((product) => product.category === activeCategory);
  const categoryEmojis: Record<ProductCategory, string> = {
    Pečivo: "🥖",
    "Mléčné výrobky": "🥛",
    Uzeniny: "🥩",
    "Ovoce a zelenina": "🍎",
  };

  const chooseCategory = (category: CategoryFilter) => {
    onCategoryChange(category);
    window.setTimeout(() => {
      document.getElementById("katalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  return (
    <div className="min-h-screen bg-[#f8faf7]">
      <div className="announcement">
        <div className="shell announcement__inner">
          <span className="announcement__message">
            <span className="announcement__dot" /> Vaše sousedská prodejna s poctivým výběrem
          </span>
          <span className="announcement__hours">
            <Icon name="clock" size={13} /> Čerstvý výběr každý den
          </span>
        </div>
      </div>

      <header className="site-header">
        <div className="shell site-header__inner">
          <a className="brand" href="#domu" aria-label="Moje Sámoška — úvodní stránka">
            <span className="brand__mark">
              <Icon name="leaf" size={23} />
            </span>
            <span className="brand__copy">
              <span className="brand__name">Moje Sámoška</span>
              <span className="brand__tagline">Dobré věci od sousedů</span>
            </span>
          </a>

          <nav className="site-nav" aria-label="Hlavní navigace">
            <a className="site-nav__link" href="#akce">
              Akční nabídka
            </a>
            {CATEGORIES.map((category) => (
              <button
                className="site-nav__link"
                key={category}
                onClick={() => chooseCategory(category)}
                type="button"
              >
                {category === "Ovoce a zelenina" ? "Ovoce & zelenina" : category}
              </button>
            ))}
          </nav>

        </div>
        <nav className="shell mobile-category-nav" aria-label="Kategorie produktů">
          <a className="mobile-category-nav__link" href="#akce">Akce</a>
          {CATEGORIES.map((category) => (
            <button
              className="mobile-category-nav__link"
              key={category}
              onClick={() => chooseCategory(category)}
              type="button"
            >
              {category === "Ovoce a zelenina" ? "Ovoce & zelenina" : category}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <section className="shell hero" id="domu">
          <div className="hero__copy">
            <span className="eyebrow">
              <span className="eyebrow__dot" /> Vaše sousedství, vaše sámoška
            </span>
            <h1>
              Čerstvé potraviny <span>každý den.</span>
            </h1>
            <p className="hero__description">
              Dobré jídlo nemusí cestovat přes půl světa. Vyberte si poctivé každodenní dobroty,
              čerstvé pečivo i něco navíc za příjemnou cenu.
            </p>
            <div className="hero__actions">
              <a className="btn btn--primary" href="#katalog">
                Prohlédnout nabídku <Icon name="arrow" size={17} />
              </a>
              <a className="btn btn--soft" href="#akce">
                Dnešní akce
              </a>
            </div>
            <div className="hero__note">
              <span className="hero__note-mark">
                <Icon name="leaf" size={16} />
              </span>
              <span>Malý obchod. Velká radost z dobrých surovin.</span>
            </div>
          </div>

          <div className="hero__visual" aria-label="Čerstvá zelenina a suroviny">
            <div className="hero__photo-frame">
              <img className="hero__photo" src={HERO_IMAGE} alt="Čerstvá zelenina a barevné suroviny" />
              <div className="hero__photo-caption">
                <div>
                  <small>Každý den něco dobrého</small>
                  <strong>Čerstvost, kterou poznáte.</strong>
                </div>
                <span>
                  <Icon name="arrow" size={18} />
                </span>
              </div>
            </div>
            <div className="hero__seal" aria-label="Čerstvý výběr">
              <Icon name="leaf" size={23} />
              <strong>Čerstvý<br />výběr</strong>
            </div>
          </div>
        </section>

        <section className="shell benefits" aria-label="Proč nakoupit u nás">
          <div className="benefit">
            <span className="benefit__icon">
              <Icon name="leaf" size={19} />
            </span>
            <span>
              <strong>Pečlivě vybraný sortiment</strong>
              <small>Každodenní dobroty na jednom místě</small>
            </span>
          </div>
          <div className="benefit">
            <span className="benefit__icon">
              <Icon name="bag" size={19} />
            </span>
            <span>
              <strong>Blízko, když je potřeba</strong>
              <small>Rychlý nákup bez zbytečné cesty</small>
            </span>
          </div>
          <div className="benefit">
            <span className="benefit__icon">
              <Icon name="star" size={19} />
            </span>
            <span>
              <strong>Férové ceny a akce</strong>
              <small>Dobrá kvalita, příjemná cena</small>
            </span>
          </div>
        </section>

        <section className="section section--sale" id="akce">
          <div className="shell">
            <div className="section-heading">
              <div className="section-heading__copy">
                <span className="section-kicker">Něco navíc za lepší cenu</span>
                <h2>Akční nabídka</h2>
                <p>Vybrané dobroty, které právě stojí za to. Nabídka se může kdykoli změnit.</p>
              </div>
              <span className="section-heading__aside">
                {actionProducts.length} {actionProducts.length === 1 ? "produkt v akci" : "produkty v akci"}
              </span>
            </div>
            {actionProducts.length > 0 ? (
              <div className="product-grid">
                {actionProducts.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <strong>Nové akce právě chystáme.</strong>
                Mrkněte zatím na naši nabídku v katalogu.
              </div>
            )}
          </div>
        </section>

        <section className="section" id="katalog">
          <div className="shell">
            <div className="section-heading">
              <div className="section-heading__copy">
                <span className="section-kicker">Malý obchod, spousta dobrých věcí</span>
                <h2>Co najdete v naší sámošce</h2>
                <p>Prohlédněte si aktuální sortiment a dostupnost. Vyberte si kategorii, která vás zajímá.</p>
              </div>
              <span className="section-heading__aside">
                {products.length} {products.length === 1 ? "produkt v nabídce" : "produktů v nabídce"}
              </span>
            </div>

            <div className="filter-list" aria-label="Filtrovat produkty podle kategorie">
              <button
                aria-pressed={activeCategory === "Vše"}
                className={`filter-chip ${activeCategory === "Vše" ? "filter-chip--active" : ""}`}
                onClick={() => onCategoryChange("Vše")}
                type="button"
              >
                Všechny potraviny <span className="filter-chip__count">{products.length}</span>
              </button>
              {CATEGORIES.map((category) => {
                const count = products.filter((product) => product.category === category).length;
                return (
                  <button
                    aria-pressed={activeCategory === category}
                    className={`filter-chip ${activeCategory === category ? "filter-chip--active" : ""}`}
                    key={category}
                    onClick={() => onCategoryChange(category)}
                    type="button"
                  >
                    <span className="filter-chip__emoji" aria-hidden="true">{categoryEmojis[category]}</span>
                    {category}
                    <span className="filter-chip__count">{count}</span>
                  </button>
                );
              })}
            </div>

            {visibleProducts.length > 0 ? (
              <div className="product-grid">
                {visibleProducts.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            ) : (
              <div className="catalog-empty">
                <strong>V této kategorii zatím nic není.</strong>
                Zkuste vybrat jinou kategorii nebo se vraťte později.
              </div>
            )}
          </div>
        </section>

        <section className="shell local-banner">
          <div className="local-banner__copy">
            <span>Moje Sámoška — demo ukázka</span>
            <h2>Všechno dobré začíná za rohem.</h2>
            <p>Poctivý výběr pro každodenní vaření i malou radost cestou domů.</p>
          </div>
          <a className="btn btn--primary" href="#katalog">
            Prohlédnout sortiment <Icon name="arrow" size={16} />
          </a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <div className="brand">
            <span className="brand__mark">
              <Icon name="leaf" size={21} />
            </span>
            <span className="brand__copy">
              <span className="brand__name">Moje Sámoška</span>
              <span className="brand__tagline">Dobré věci od sousedů</span>
            </span>
          </div>
          <span className="footer__copy">Ukázkový web pro lokální prodejnu · nabídka se může změnit.</span>
          <div className="footer__links">
            <a href="#domu">Nahoru ↑</a>
            <a href="#katalog">Sortiment</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AdminDashboard({
  products,
  onAdd,
  onEdit,
  onDelete,
  onBackToStore,
  onLogout,
}: {
  products: Product[];
  onAdd: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onBackToStore: () => void;
  onLogout: () => void;
}) {
  const stockUnits = products.reduce(
    (total, product) => total + (isProductAvailable(product) ? product.stock_count : 0),
    0,
  );
  const availableProducts = products.filter(isProductAvailable).length;
  const actionCount = products.filter((product) => product.is_action).length;

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="shell admin-header__inner">
          <div className="admin-identity">
            <a className="brand" href="#admin" aria-label="Moje Sámoška — administrační přehled">
              <span className="brand__mark">
                <Icon name="leaf" size={23} />
              </span>
              <span className="brand__copy">
                <span className="brand__name">Moje Sámoška</span>
                <span className="brand__tagline">Portál pro majitele</span>
              </span>
            </a>
            <span className="admin-label">Ukázkový režim</span>
          </div>
          <div className="admin-header__actions">
            <button className="btn btn--soft" onClick={onBackToStore} type="button">
              Zpět na web
            </button>
            <button className="btn btn--dark-outline" onClick={onLogout} type="button">
              <Icon name="logout" size={15} /> Odhlásit
            </button>
          </div>
        </div>
      </header>

      <main className="shell admin-main" id="admin">
        <div className="admin-welcome">
          <div className="admin-welcome__copy">
            <span className="section-kicker">Přehled pro majitele</span>
            <h1>Správa sortimentu</h1>
            <p>Upravte nabídku, ceny i sklad. Změny se na veřejném webu projeví okamžitě.</p>
          </div>
        </div>

        <section className="admin-stats" aria-label="Souhrn sortimentu">
          <article className="stat-card">
            <div className="stat-card__top">
              <span className="stat-card__icon"><Icon name="bag" size={17} /></span>
              <span>Produkty v nabídce</span>
            </div>
            <strong className="stat-card__value">{products.length}</strong>
            <small className="stat-card__hint">Celkový počet položek katalogu</small>
          </article>
          <article className="stat-card">
            <div className="stat-card__top">
              <span className="stat-card__icon"><Icon name="check" size={17} /></span>
              <span>Kusy skladem</span>
            </div>
            <strong className="stat-card__value">{stockUnits}</strong>
            <small className="stat-card__hint">Napříč {availableProducts} dostupnými produkty</small>
          </article>
          <article className="stat-card">
            <div className="stat-card__top">
              <span className="stat-card__icon"><Icon name="star" size={17} /></span>
              <span>Produkty v akci</span>
            </div>
            <strong className="stat-card__value">{actionCount}</strong>
            <small className="stat-card__hint">Zobrazené v akční nabídce webu</small>
          </article>
        </section>

        <section className="inventory-panel" aria-label="Tabulka produktů">
          <div className="inventory-panel__header">
            <div className="inventory-panel__title">
              <h2>Všechny produkty</h2>
              <p>Přehled položek a jejich aktuální dostupnosti</p>
            </div>
            <button className="btn btn--primary" onClick={onAdd} type="button">
              <Icon name="plus" size={17} /> Přidat nový produkt
            </button>
          </div>

          {products.length > 0 ? (
            <div className="table-scroll">
              <table className="product-table">
                <thead>
                  <tr>
                    <th scope="col">Produkt</th>
                    <th scope="col">Cena</th>
                    <th scope="col">Nabídka</th>
                    <th scope="col">Stav skladu</th>
                    <th scope="col">Správa</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="table-product">
                          <span className="table-product__image">
                            <img src={product.image_url || CATEGORY_IMAGES[product.category]} alt="" />
                          </span>
                          <span className="table-product__text">
                            <strong>{product.title}</strong>
                            <small>{product.category}</small>
                          </span>
                        </div>
                      </td>
                      <td className="table-price">{formatPrice(product.price)}</td>
                      <td>
                        {product.is_action ? (
                          <span className="sale-badge"><Icon name="star" size={10} /> AKCE</span>
                        ) : (
                          <span style={{ color: "#9aa49c" }}>—</span>
                        )}
                      </td>
                      <td><StockBadge product={product} /></td>
                      <td>
                        <div className="table-action-group">
                          <button
                            aria-label={`Upravit produkt ${product.title}`}
                            className="table-action-btn"
                            onClick={() => onEdit(product)}
                            type="button"
                          >
                            <Icon name="edit" size={14} /> Upravit
                          </button>
                          <button
                            aria-label={`Smazat produkt ${product.title}`}
                            className="table-action-btn table-action-btn--delete"
                            onClick={() => onDelete(product)}
                            type="button"
                          >
                            <Icon name="trash" size={14} /> Smazat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="inventory-empty">
              Sortiment je zatím prázdný. Přidejte první produkt a objeví se také na veřejném webu.
            </div>
          )}
        </section>

        <p className="admin-footnote">
          <span className="admin-footnote__dot" />
          Demo ukládá změny do interního stavu stránky. Po obnovení se načtou výchozí ukázková data.
        </p>
      </main>
    </div>
  );
}

function LoginModal({
  onClose,
  onLogin,
}: {
  onClose: () => void;
  onLogin: (username: string, password: string) => boolean;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEscapeToClose(onClose);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setError("Vyplňte prosím jméno i heslo.");
      return;
    }
    if (!onLogin(username.trim(), password)) {
      setError("Zadané jméno nebo heslo nesouhlasí. Zkuste admin / admin.");
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => closeOnBackdrop(event, onClose)}>
      <section
        aria-labelledby="login-title"
        aria-modal="true"
        className="modal-card"
        role="dialog"
      >
        <button className="modal-close" onClick={onClose} type="button" aria-label="Zavřít přihlášení">
          <Icon name="close" size={17} />
        </button>
        <span className="modal-icon"><Icon name="lock" size={22} /></span>
        <h2 className="modal-title" id="login-title">Vítejte v portálu</h2>
        <p className="modal-subtitle">
          Přihlaste se do administračního rozhraní a spravujte sortiment své sámošky.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span className="form-label">Jméno</span>
            <input
              autoComplete="username"
              autoFocus
              className="form-input"
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Zadejte jméno"
              value={username}
            />
          </label>
          <label className="form-field">
            <span className="form-label">Heslo</span>
            <span className="password-input-wrap">
              <input
                autoComplete="current-password"
                className="form-input"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Zadejte heslo"
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                aria-label={showPassword ? "Skrýt heslo" : "Zobrazit heslo"}
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? "Skrýt" : "Zobrazit"}
              </button>
            </span>
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="demo-credentials">
            <span>Ukázkové přihlášení</span>
            <strong>admin / admin</strong>
          </div>
          <button className="btn btn--primary btn--full" type="submit">
            Přihlásit se <Icon name="arrow" size={16} />
          </button>
        </form>
      </section>
    </div>
  );
}

function ProductModal({
  mode,
  product,
  onClose,
  onSave,
}: {
  mode: "create" | "edit";
  product?: Product;
  onClose: () => void;
  onSave: (values: ProductFormValues) => void;
}) {
  const initial = product
    ? {
        title: product.title,
        price: product.price,
        category: product.category,
        image_url: product.image_url,
        is_action: product.is_action,
        in_stock: product.in_stock,
        stock_count: product.stock_count,
      }
    : {
        title: "",
        price: 0,
        category: "Pečivo" as ProductCategory,
        image_url: "",
        is_action: false,
        in_stock: true,
        stock_count: 1,
      };

  const [title, setTitle] = useState(initial.title);
  const [price, setPrice] = useState(String(initial.price || ""));
  const [category, setCategory] = useState<ProductCategory>(initial.category);
  const [imageUrl, setImageUrl] = useState(initial.image_url);
  const [isAction, setIsAction] = useState(initial.is_action);
  const [inStock, setInStock] = useState(initial.in_stock);
  const [stockCount, setStockCount] = useState(String(initial.stock_count));
  const [error, setError] = useState("");

  useEscapeToClose(onClose);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanTitle = title.trim();
    const parsedPrice = Number(price.replace(",", "."));
    const parsedStock = Number(stockCount);
    const cleanImageUrl = imageUrl.trim();

    if (!cleanTitle) {
      setError("Doplňte název produktu.");
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Cena musí být číslo větší než nula.");
      return;
    }
    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      setError("Počet kusů musí být celé číslo od nuly výše.");
      return;
    }
    if (cleanImageUrl) {
      try {
        const parsedUrl = new URL(cleanImageUrl);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          throw new Error("Unsupported URL protocol");
        }
      } catch {
        setError("Adresa fotografie musí být platná URL začínající http:// nebo https://.");
        return;
      }
    }

    const normalizedStock = inStock ? parsedStock : 0;
    onSave({
      title: cleanTitle,
      price: parsedPrice,
      category,
      image_url: cleanImageUrl || CATEGORY_IMAGES[category],
      is_action: isAction,
      in_stock: inStock && normalizedStock > 0,
      stock_count: normalizedStock,
    });
  };

  const handleStockToggle = (checked: boolean) => {
    setInStock(checked);
    if (!checked) {
      setStockCount("0");
    } else if (Number(stockCount) <= 0) {
      setStockCount("1");
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={(event) => closeOnBackdrop(event, onClose)}>
      <section
        aria-labelledby="product-modal-title"
        aria-modal="true"
        className="modal-card modal-card--wide"
        role="dialog"
      >
        <button className="modal-close" onClick={onClose} type="button" aria-label="Zavřít formulář">
          <Icon name="close" size={17} />
        </button>
        <span className="modal-icon"><Icon name={mode === "create" ? "plus" : "edit"} size={22} /></span>
        <h2 className="modal-title" id="product-modal-title">
          {mode === "create" ? "Přidat nový produkt" : "Upravit produkt"}
        </h2>
        <p className="modal-subtitle">
          Vyplňte údaje, které se hned promítnou do veřejného katalogu a přehledu skladu.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field form-field--full">
              <span className="form-label">Název produktu</span>
              <input
                autoFocus
                className="form-input"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Např. Čerstvý chléb"
                value={title}
              />
            </label>
            <label className="form-field">
              <span className="form-label">Cena (Kč)</span>
              <input
                className="form-input"
                min="0.01"
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Např. 29"
                step="0.01"
                type="number"
                value={price}
              />
            </label>
            <label className="form-field">
              <span className="form-label">Kategorie</span>
              <select
                className="form-select"
                onChange={(event) => setCategory(event.target.value as ProductCategory)}
                value={category}
              >
                {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="form-field form-field--full">
              <span className="form-label">Fotografie produktu — URL <span style={{ color: "#95a097", fontWeight: 500 }}>(nepovinné)</span></span>
              <input
                className="form-input"
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Prázdné = automatický obrázek podle kategorie"
                type="url"
                value={imageUrl}
              />
              <small className="form-hint">Použijte přímý odkaz na obrázek, například z Unsplash.</small>
            </label>
            <label className={`checkbox-card ${isAction ? "checkbox-card--checked" : ""}`}>
              <input checked={isAction} onChange={(event) => setIsAction(event.target.checked)} type="checkbox" />
              <span>Zařadit do akční nabídky</span>
            </label>
            <label className={`checkbox-card ${inStock ? "checkbox-card--checked" : ""}`}>
              <input checked={inStock} onChange={(event) => handleStockToggle(event.target.checked)} type="checkbox" />
              <span>Skladem</span>
            </label>
            <label className="form-field form-field--full">
              <span className="form-label">Počet kusů skladem</span>
              <input
                className="form-input"
                disabled={!inStock}
                min="0"
                onChange={(event) => setStockCount(event.target.value)}
                placeholder="0"
                step="1"
                type="number"
                value={stockCount}
              />
              <small className="form-hint">
                {inStock ? "Při nulovém počtu se produkt zobrazí jako vyprodaný." : "Produkt bude označen jako vyprodaný a počet kusů bude 0."}
              </small>
            </label>
          </div>

          {error && <p className="form-error" role="alert" style={{ marginTop: 14 }}>{error}</p>}

          <div className="modal-actions">
            <button className="btn btn--soft" onClick={onClose} type="button">Zrušit</button>
            <button className="btn btn--primary" type="submit">
              <Icon name="check" size={16} /> {mode === "create" ? "Přidat produkt" : "Uložit změny"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ConfirmDeleteModal({
  product,
  onCancel,
  onConfirm,
}: {
  product: Product;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEscapeToClose(onCancel);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => closeOnBackdrop(event, onCancel)}>
      <section aria-labelledby="delete-title" aria-modal="true" className="modal-card" role="dialog">
        <button className="modal-close" onClick={onCancel} type="button" aria-label="Zavřít potvrzení">
          <Icon name="close" size={17} />
        </button>
        <span className="modal-icon" style={{ background: "#fff1ef", color: "#a8413b" }}>
          <Icon name="trash" size={21} />
        </span>
        <h2 className="modal-title" id="delete-title">Smazat produkt?</h2>
        <p className="confirm-copy">
          Opravdu chcete odstranit produkt <span className="confirm-product-name">{product.title}</span>?
          Změna se ihned projeví v katalogu.
        </p>
        <div className="modal-actions">
          <button className="btn btn--soft" onClick={onCancel} type="button">Ponechat</button>
          <button className="btn btn--danger" onClick={onConfirm} type="button">
            <Icon name="trash" size={15} /> Smazat produkt
          </button>
        </div>
      </section>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="toast__check"><Icon name="check" size={14} /></span>
      {message}
    </div>
  );
}

function useEscapeToClose(onClose: () => void) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);
}

function closeOnBackdrop(event: MouseEvent<HTMLDivElement>, onClose: () => void) {
  if (event.target === event.currentTarget) onClose();
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>(() => INITIAL_PRODUCTS.map((product) => ({ ...product })));
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("Vše");
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [productModal, setProductModal] = useState<ProductModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(""), 2800);
  };

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("admin") === "1") {
      setLoginOpen(true);
    }
  }, []);

  const clearAdminQuery = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("admin");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setIsAdminView(true);
      setLoginOpen(false);
      showToast("Přihlášení proběhlo úspěšně.");
      return true;
    }
    return false;
  };

  const handleSaveProduct = (values: ProductFormValues) => {
    if (!productModal) return;

    if (productModal.kind === "edit") {
      const productId = productModal.product.id;
      setProducts((current) => current.map((product) =>
        product.id === productId ? { ...values, id: productId } : product,
      ));
      showToast("Změny produktu byly uloženy.");
    } else {
      const newProduct: Product = {
        ...values,
        id: typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `product-${Date.now()}-${Math.round(Math.random() * 100000)}`,
      };
      setProducts((current) => [newProduct, ...current]);
      showToast("Nový produkt byl přidán do katalogu.");
    }

    setProductModal(null);
  };

  const handleDeleteProduct = () => {
    if (!deleteTarget) return;
    const deletedTitle = deleteTarget.title;
    setProducts((current) => current.filter((product) => product.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast(`Produkt „${deletedTitle}“ byl smazán.`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminView(false);
    setProductModal(null);
    setDeleteTarget(null);
    clearAdminQuery();
    showToast("Byli jste odhlášeni z portálu.");
  };

  const closeLogin = () => {
    setLoginOpen(false);
    clearAdminQuery();
  };
  const closeProductModal = () => setProductModal(null);
  const closeDeleteModal = () => setDeleteTarget(null);

  return (
    <>
      {isAdminView ? (
        <AdminDashboard
          onAdd={() => setProductModal({ kind: "create" })}
          onBackToStore={() => {
            setIsAdminView(false);
            clearAdminQuery();
          }}
          onDelete={setDeleteTarget}
          onEdit={(product) => setProductModal({ kind: "edit", product })}
          onLogout={handleLogout}
          products={products}
        />
      ) : (
        <PublicStore
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          products={products}
        />
      )}

      {loginOpen && !isAdminView && <LoginModal onClose={closeLogin} onLogin={handleLogin} />}
      {productModal && isAdminView && (
        <ProductModal
          key={productModal.kind === "edit" ? productModal.product.id : "new-product"}
          mode={productModal.kind}
          onClose={closeProductModal}
          onSave={handleSaveProduct}
          product={productModal.kind === "edit" ? productModal.product : undefined}
        />
      )}
      {deleteTarget && isAdminView && (
        <ConfirmDeleteModal
          onCancel={closeDeleteModal}
          onConfirm={handleDeleteProduct}
          product={deleteTarget}
        />
      )}
      <Toast message={toastMessage} />
    </>
  );
}
