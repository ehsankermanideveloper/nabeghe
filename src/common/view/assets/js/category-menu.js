let menuFetchPromise = null;

function registerCategoryStore() {
  window.Alpine.store('categoryMenu', {
    items: [],
    loading: false,
    error: false,
    ready: false,

    async load() {
      if (this.ready) {
        return;
      }
      if (menuFetchPromise) {
        return menuFetchPromise;
      }

      this.loading = true;
      this.error = false;

      menuFetchPromise = (async () => {
        try {
          const response = await fetch((window._lp || '') + '/api/categories/menu', {
            headers: { Accept: 'application/json' },
          });
          if (!response.ok) {
            throw new Error('Failed to load categories');
          }
          const body = await response.json();
          this.items = Array.isArray(body.data) ? body.data : [];
          this.ready = true;
        } catch {
          this.error = true;
          this.items = [];
        } finally {
          this.loading = false;
        }
      })();

      return menuFetchPromise;
    },
  });
}

function registerCategoryMenu() {
  window.Alpine.data('categoryMenu', () => ({
    open: false,

    get items() {
      return this.$store.categoryMenu.items;
    },
    get loading() {
      return this.$store.categoryMenu.loading;
    },
    get error() {
      return this.$store.categoryMenu.error;
    },

    toggleOpen() {
      this.open = !this.open;
    },

    closeOpen() {
      this.open = false;
    },

    hasChildren(item) {
      return Array.isArray(item.children) && item.children.length > 0;
    },
  }));
}

function bootCategoryMenu() {
  registerCategoryStore();
  registerCategoryMenu();
  void window.Alpine.store('categoryMenu').load();
}

document.addEventListener('alpine:init', bootCategoryMenu);
