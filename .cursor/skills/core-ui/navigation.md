---
description: >-
  Menu, NavigationMenu, Toolbar, Tabs, Breadcrumb. Responsive toolbar/tabs patterns. Triggers → button.md#compose-button-through-render.
---

# Navigation

Menu, NavigationMenu, Toolbar, Tabs, Breadcrumb. Triggers with `Button` → [button.md](button.md#compose-button-through-render).

## Menu

Keep options as `Menu.Item` or `Menu.SubmenuTrigger` so keyboard navigation, disabled state, and variants work. Use `variant='danger'` for destructive actions. Style **`Menu.Trigger`** with **`render={<Button … />}`** — not hand-written `btn-*` classes.

```tsx
import { Button, Menu } from '@polyms/core-ui'

const actionsMenu = (
  <Menu>
    <Menu.Trigger render={<Button variant='primary' outlined />}>Actions</Menu.Trigger>
    <Menu.Content>
      <Menu.Item>Edit</Menu.Item>
      <Menu.Item>Duplicate</Menu.Item>
      <Menu.Separator />
      <Menu.Item variant='danger'>Delete</Menu.Item>
    </Menu.Content>
  </Menu>
)
```

Submenus use `Menu.SubmenuRoot`, `Menu.SubmenuTrigger`, and nested `Menu.Content`.

## NavigationMenu

Each `NavigationMenu.Item` owns its trigger/content, and one shared `NavigationMenu.Viewport` belongs at the end of the root.

```tsx
import { NavigationMenu } from '@polyms/core-ui'

const siteNavigation = (
  <NavigationMenu>
    <NavigationMenu.List variant='bare'>
      <NavigationMenu.Item value='products'>
        <NavigationMenu.Trigger size='lg'>
          Products
          <NavigationMenu.Icon />
        </NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Link href='/launchpad' variant='soft'>
            Launchpad
          </NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href='/pricing' size='lg' variant='trigger'>
          Pricing
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Viewport />
  </NavigationMenu>
)
```

Use `NavigationMenu.Link render={...}` for router integration. Use `active` for current page state.

Use `NavigationMenu.GroupLabel`, `NavigationMenu.Separator`, and `NavigationMenu.Footer` to structure mega menu content without raw utility bundles. `NavigationMenu.Icon` renders the default rotating chevron; pass children to swap the icon while preserving open-state rotation.

`NavigationMenu.Link` variants:

- `variant='soft'`: card-style row inside `NavigationMenu.Content`.
- `variant='danger'`: destructive row styling for sign-out, revoke, or delete actions.
- `variant='trigger'`: pill styling for static entries inside `NavigationMenu.List`.

```tsx
<NavigationMenu.Content>
  <NavigationMenu.GroupLabel>Products</NavigationMenu.GroupLabel>
  <NavigationMenu.Link href='/launchpad' variant='soft'>
    Launchpad
  </NavigationMenu.Link>
  <NavigationMenu.Separator />
  <NavigationMenu.Footer>
    <span>Postgres branching is now GA.</span>
    <a className='link link-primary' href='/changelog'>
      Read changelog
    </a>
  </NavigationMenu.Footer>
</NavigationMenu.Content>
```

## Toolbar

Wrap toolbar actions in `Toolbar.Button` for roving focus. Compose `Toggle`, `Menu.Trigger`, `Select.Trigger`, or `Button` through the `render` prop. Always provide `aria-label` on `Toolbar` and `Toolbar.Group`.

```tsx
import { Toggle, ToggleGroup, Toolbar } from '@polyms/core-ui'

const formattingToolbar = (
  <Toolbar aria-label='Formatting'>
    <Toolbar.Group aria-label='Text alignment'>
      <ToggleGroup className='toolbar-group' aria-label='Alignment'>
        <Toolbar.Button render={<Toggle />} value='left'>
          Left
        </Toolbar.Button>
        <Toolbar.Button render={<Toggle />} value='right'>
          Right
        </Toolbar.Button>
      </ToggleGroup>
    </Toolbar.Group>
  </Toolbar>
)
```

For tooltips, pass `Toolbar.Button` to `Tooltip.Trigger` through `render`. Place `Toolbar.Input` at the end of a horizontal toolbar so text-cursor keyboard behavior remains predictable.

### Responsive (Toolbar)

The library toolbar is a single horizontal (or vertical) flex row — **your app wrapper** handles narrow viewports. See [quality.md#responsive-and-mobile-first](quality.md#responsive-and-mobile-first).

| Situation                               | Pattern                                                                                                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Many icon groups (table header, editor) | Wrap in `overflow-x-auto`; `Toolbar` with `className='w-max'` so groups scroll inside the wrapper, not the whole page                                                           |
| Secondary actions overflow              | Hide extra `Toolbar.Group` at `sm:`; put overflow in a **`Menu`** whose trigger is **`Toolbar.Button render={<Menu.Trigger />}`** inside the same `Toolbar`                     |
| Icon-only controls                      | `Toolbar.Button` with `aria-label` — library min height ~32px; use `Button icon size='lg'` inside `render` when touch targets feel tight ([button.md](button.md#touch-targets)) |
| Side rail (wide settings)               | `orientation='vertical'` on `Toolbar` at `lg:` — pair with a column layout you own                                                                                              |

```tsx
import { Button, Menu, Toolbar } from '@polyms/core-ui'

const tableToolbar = (
  <div className='overflow-x-auto'>
    <Toolbar aria-label='Table actions' className='w-max min-w-full'>
      <Toolbar.Group aria-label='Selection'>
        <Toolbar.Button render={<Button size='sm' variant='light' />}>Export</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Separator className='hidden sm:block' orientation='vertical' />
      <Toolbar.Group aria-label='View' className='hidden sm:inline-flex'>
        <Toolbar.Button render={<Button size='sm' variant='light' />}>Columns</Toolbar.Button>
      </Toolbar.Group>
      <Menu>
        <Toolbar.Button className='sm:hidden' render={<Menu.Trigger />}>
          More
        </Toolbar.Button>
        <Menu.Content>
          <Menu.Item>Columns</Menu.Item>
        </Menu.Content>
      </Menu>
    </Toolbar>
  </div>
)
```

| Rule                    | Detail                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Do not shrink**       | Avoid `scale-90` / `text-xs` on `Toolbar` to fit — scroll or collapse into `Menu` instead                                            |
| **Wrap vs scroll**      | `flex-wrap` only when labeled buttons can stack cleanly; icon-heavy rows → horizontal scroll                                         |
| **Overflow menu**       | `Menu` + `Toolbar.Button render={<Menu.Trigger />}` **inside** `Toolbar` — not a standalone `Button` beside the shell                |
| **Sticky table chrome** | Sticky header + toolbar: reserve `z-toolbar` / layout padding so content does not slide under ([css-utilities.md](css-utilities.md)) |

## Tabs

**Tree:** `Tabs` → `Tabs.List` + `Tabs.Tab` … + matching `Tabs.Panel` per `value`.

```tsx
import { Tabs } from '@polyms/core-ui'

const accountTabs = (
  <Tabs defaultValue='profile'>
    <Tabs.List>
      <Tabs.Tab value='profile'>Profile</Tabs.Tab>
      <Tabs.Tab value='account'>Account</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value='profile'>
      <h3 className='h3'>Profile</h3>
      <p className='text-muted'>How others see you on this workspace.</p>
    </Tabs.Panel>
    <Tabs.Panel value='account'>
      <h3 className='h3'>Account</h3>
      <p className='text-muted'>Password and security.</p>
    </Tabs.Panel>
  </Tabs>
)
```

| Rule                | Detail                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Values**          | `Tabs.Tab` `value` must match its `Tabs.Panel` `value`                                                                              |
| **Controlled**      | `value` + `onValueChange` on `Tabs` root                                                                                            |
| **Panels required** | Every tab needs a `Tabs.Panel` — no tab labels without content                                                                      |
| **Long lists**      | Many sections → prefer `Tabs` over stacked `divide-y` blocks ([quality.md#lists-and-collections](quality.md#lists-and-collections)) |
| **Orientation**     | `orientation='horizontal'` (default) or `'vertical'` on `Tabs` root — drives arrow-key direction and indicator geometry             |

### Responsive (Tabs)

`Tabs.Tab` labels use `white-space: nowrap` in package CSS — long tab rows need an **app-owned scroll or layout**, not smaller font on tabs.

| Situation                          | Pattern                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 4+ horizontal tabs on phone        | Wrap `Tabs.List` in `overflow-x-auto` (optional negative margin + padding); add `scrollbar-none` to hide the scrollbar while keeping scroll |
| Settings / account (many sections) | `orientation='vertical'` + `flex flex-col md:flex-row` — list as a side rail from `md:`                                                     |
| Too many sections for tabs         | Prefer `Accordion` ([display.md](display.md#accordion)) or `Select` for section pick on narrow viewports                                    |

**Horizontal scroll** (peer tabs, filters):

```tsx
import { Tabs } from '@polyms/core-ui'

const filterTabs = (
  <Tabs defaultValue='all'>
    <div className='-mx-4 overflow-x-auto px-4 scrollbar-none md:mx-0 md:overflow-visible md:px-0'>
      <Tabs.List className='w-max min-w-full'>
        <Tabs.Tab value='all'>All</Tabs.Tab>
        <Tabs.Tab value='open'>Open</Tabs.Tab>
        <Tabs.Tab value='pending'>Pending review</Tabs.Tab>
        <Tabs.Tab value='archived'>Archived</Tabs.Tab>
      </Tabs.List>
    </div>
    <Tabs.Panel value='all'>…</Tabs.Panel>
    {/* one Tabs.Panel per value */}
  </Tabs>
)
```

**Vertical settings rail** (mobile stacks, desktop side nav):

```tsx
import { Tabs } from '@polyms/core-ui'

const settingsTabs = (
  <Tabs className='flex flex-col gap-4 md:flex-row md:gap-6' defaultValue='profile' orientation='vertical'>
    <Tabs.List className='w-full shrink-0 md:w-48'>
      <Tabs.Tab value='profile'>Profile</Tabs.Tab>
      <Tabs.Tab value='account'>Account</Tabs.Tab>
      <Tabs.Tab value='notifications'>Notifications</Tabs.Tab>
    </Tabs.List>
    <div className='min-w-0 flex-1'>
      <Tabs.Panel value='profile'>…</Tabs.Panel>
      <Tabs.Panel value='account'>…</Tabs.Panel>
      <Tabs.Panel value='notifications'>…</Tabs.Panel>
    </div>
  </Tabs>
)
```

| Rule                    | Detail                                                                                                   |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| **Panel width**         | `min-w-0 flex-1` on the panel column prevents flex overflow on long forms inside `Tabs.Panel`            |
| **Tab count**           | Aim ≤5 visible horizontal tabs on mobile — move extras to scroll or a different nav primitive            |
| **Do not restyle list** | Avoid overriding `tabs-tab` / `tabs-indicator` for responsive — wrap `Tabs.List` or switch `orientation` |

## Breadcrumb

**Tree:** `Breadcrumb` → `Breadcrumb.Item` (list items).

```tsx
import { Breadcrumb } from '@polyms/core-ui'

const projectBreadcrumb = (
  <Breadcrumb>
    <Breadcrumb.Item href='/projects'>Projects</Breadcrumb.Item>
    <Breadcrumb.Item href='/projects/launchpad'>Launchpad</Breadcrumb.Item>
    <Breadcrumb.Item active>Settings</Breadcrumb.Item>
  </Breadcrumb>
)
```

| Rule             | Detail                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Current page** | `active` or omit `href` on the last crumb — sets `aria-current="page"` on that item only; ancestor links with `href` do not |
| **Router links** | `Breadcrumb.Item` `render` for client-side links — confirm props in `index.d.ts`                                            |
