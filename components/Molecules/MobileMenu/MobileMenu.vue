<template>
  <ul class="drawer-list">
    <li
      v-for="(item, index) in menuItems"
      :key="index"
      class="drawer-list__item"
      :style="{ '--i': index }"
    >
      <button
        type="button"
        class="drawer-row"
        :class="{ 'is-active': isActive(item.to) }"
        :aria-current="isActive(item.to) ? 'page' : undefined"
        :aria-expanded="item.subMenu?.length ? !!item.isSubMenuOpen : undefined"
        @click="onItemClick(item)"
      >
        <span class="drawer-row__thumb" aria-hidden="true">
          <img v-if="item.image" :src="item.image" alt="" loading="lazy" />
          <Icon
            v-else
            :name="item.to === '/pokedex' ? 'heroicons:sparkles-20-solid' : 'heroicons:squares-2x2-20-solid'"
            size="20"
          />
        </span>
        <span class="drawer-row__label">{{ item.name }}</span>
        <span
          class="drawer-row__chevron"
          :class="{ 'is-open': item.subMenu?.length && item.isSubMenuOpen }"
          aria-hidden="true"
        >
          <Icon
            :name="item.subMenu?.length ? 'heroicons:chevron-down-20-solid' : 'heroicons:chevron-right-20-solid'"
            size="18"
          />
        </span>
      </button>
      <ul v-if="item.subMenu?.length && item.isSubMenuOpen" class="drawer-sub">
        <li v-for="(subItem, index) in item.subMenu" :key="index">
          <button
            type="button"
            class="drawer-sub__row"
            @click="navigate(subItem.to)"
          >
            {{ subItem.label }}
            <Icon name="heroicons:arrow-right-20-solid" size="16" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import useMenu, { type MenuItemType } from "~/data/menu";
const emit = defineEmits(["closeMenu"]);
const menuItems = ref<MenuItemType[]>(await useMenu());
const route = useRoute();

/** Evidenzia la voce della pagina in cui ci si trova. */
const isActive = (to: string) =>
  route.path === to || route.path.startsWith(`${to}/`);

/** Le voci senza sottomenu (le categorie) portano dritte alla pagina. */
const onItemClick = (item: MenuItemType) => {
  if (!item.subMenu?.length) {
    navigate(item.to);
    return;
  }
  item.isSubMenuOpen = !item.isSubMenuOpen;
};

const navigate = (url: string) => {
  emit("closeMenu");
  navigateTo(url);
};
</script>

<style scoped>
/* Voci grandi e facili da toccare: miniatura della categoria, nome in
   display e chevron, come le righe di un'app. */
.drawer-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer-list__item {
  animation: drawer-in 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  animation-delay: calc(var(--i, 0) * 45ms);
}

.drawer-row {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 64px;
  padding: 10px 14px 10px 10px;
  border-radius: 20px;
  border: 1px solid var(--im-line);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
  text-align: left;
  color: var(--im-ink);
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.drawer-row,
.drawer-row * {
  cursor: pointer;
}

.drawer-row:active {
  transform: scale(0.985);
}

.drawer-row:hover,
.drawer-row.is-active {
  border-color: rgba(247, 210, 216, 0.4);
  background: linear-gradient(160deg, rgba(247, 210, 216, 0.14), rgba(255, 255, 255, 0.03));
}

.drawer-row:focus-visible,
.drawer-sub__row:focus-visible {
  outline: 2px solid var(--im-teal);
  outline-offset: 2px;
}

.drawer-row__thumb {
  display: grid;
  flex: none;
  place-items: center;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: 14px;
  color: #2a0a14;
  background: linear-gradient(135deg, #fde4e8, var(--im-pink-strong));
}

.drawer-row__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-row__label {
  flex: 1;
  min-width: 0;
  font-family: "Unbounded", "Roboto Flex", sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.01em;
  overflow-wrap: anywhere;
}

.drawer-row__chevron {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--im-line);
  color: var(--im-muted);
  transition:
    transform 0.25s ease,
    color 0.2s ease,
    border-color 0.2s ease;
}

.drawer-row:hover .drawer-row__chevron,
.drawer-row.is-active .drawer-row__chevron {
  border-color: rgba(247, 210, 216, 0.5);
  color: var(--im-pink);
}

.drawer-row__chevron.is-open {
  transform: rotate(180deg);
}

.drawer-sub {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0 4px 26px;
  padding-left: 16px;
  border-left: 1px solid rgba(247, 210, 216, 0.25);
}

.drawer-sub__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding: 0 12px;
  border-radius: 14px;
  font-size: 16px;
  text-align: left;
  color: var(--im-muted);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.drawer-sub__row,
.drawer-sub__row * {
  cursor: pointer;
}

.drawer-sub__row:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--im-ink);
}

@keyframes drawer-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .drawer-list__item {
    animation: none;
  }

  .drawer-row,
  .drawer-row__chevron {
    transition: none;
  }
}
</style>
