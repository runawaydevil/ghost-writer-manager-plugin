# Ghost Writer Manager

One-way synchronization from Obsidian to Ghost CMS with post scheduling, YAML metadata control, automatic sync, and an editorial calendar view.

## Features

- 🔄 **One-way sync** from Obsidian to Ghost (keeps Ghost as your publishing platform)
- 📅 **Editorial calendar** - Sidebar view of all scheduled and published posts for the month
- 📝 **YAML frontmatter control** - Manage all Ghost metadata directly in Obsidian
- 🕐 **Post scheduling** - Schedule posts for future publication with `g_published_at`
- 🔄 **Automatic sync** - Debounced sync on file save (2s delay)
- ⏰ **Periodic sync** - Configurable interval sync (default: 15 minutes)
- ✨ **Markdown to Lexical conversion** - Full markdown support including images
- 🔒 **Paywall marker** - Control the public preview line with `--members-only--`
- 🔐 **Secure credentials** - API keys stored in Obsidian's secure keychain
- 🔑 **JWT authentication** - Secure Ghost Admin API integration
- 📊 **Status bar indicator** - Visual feedback on sync status
- 🎯 **Flexible configuration** - Custom sync folder, prefix, and intervals

## Installation

### From GitHub Releases (Recommended)

1. Go to the [Releases page](https://github.com/diegoeis/ghost-writer-manager-plugin/releases)
2. Download the latest release files:
   - `main.js`
   - `manifest.json`
   - `styles.css`
3. In your vault, navigate to `.obsidian/plugins/` folder
4. Create a new folder called `ghost-writer-manager`
5. Move the downloaded files into `.obsidian/plugins/ghost-writer-manager/`
6. Restart Obsidian or reload the app
7. Go to **Settings** → **Community Plugins**
8. Enable **Ghost Writer Manager**

### From Source (For Development)

1. Clone this repository:
   ```bash
   git clone https://github.com/diegoeis/ghost-writer-manager-plugin.git
   cd ghost-writer-manager-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your vault path for hot reload:
   ```bash
   cp dev.config.example.json dev.config.json
   # Edit dev.config.json with your vault path
   ```

4. Start dev mode with hot reload:
   ```bash
   npm run dev
   ```
   This will automatically:
   - Watch for file changes
   - Build on every change
   - Copy `main.js`, `manifest.json`, and `styles.css` to your vault
   - No manual copying needed!

5. Enable the plugin in Obsidian settings

6. Reload Obsidian (Ctrl/Cmd + R) to see changes

## Configuration

### Getting Your Ghost Admin API Key

1. Log in to your Ghost Admin panel
2. Navigate to **Settings** → **Integrations**
3. Click **Add custom integration**
4. Give it a name (e.g., "Obsidian Sync")
5. Copy the **Admin API Key** (format: `id:secret`)

### Plugin Settings

1. Open Obsidian Settings
2. Navigate to **Ghost Writer Manager** under Community Plugins
3. Configure the following:
   - **Ghost URL**: Your Ghost site URL (e.g., `https://yourblog.ghost.io`)
   - **Admin API Key**: The key you copied from Ghost (stored securely in Obsidian's keychain)
   - **Sync Folder**: Where Ghost posts will be stored in your vault (default: `Ghost Posts`)
   - **Sync Interval**: How often to check for changes in minutes (default: 15)
   - **YAML Prefix**: Prefix for Ghost metadata fields (default: `g_`)

4. Click **Test Connection** to verify your credentials

> **Note**: Your Admin API Key is stored securely using Obsidian's keychain and is not saved in plain text.

## Usage

### Editorial Calendar

Open the editorial calendar from the ribbon icon or via `Cmd/Ctrl + P` → "Open Ghost editorial calendar". The sidebar shows all published and scheduled posts for the current month:

- **Purple dot** — post is published
- **Green dot** — post is scheduled
- **Both dots** — day has both published and scheduled posts
- Click a day to filter the post list to that day; click again to show all
- Click a post title to open the linked vault note in a new tab
- Click the external link icon to open the post directly in Ghost Admin
- Use the **Today** button to return to the current month

### Commands

Available commands (Cmd/Ctrl + P):

- **Sync with Ghost** - Manually sync all files in sync folder
- **Test Ghost connection** - Verify your Ghost credentials
- **Open Ghost editorial calendar** - Open the calendar sidebar view
- **Create new Ghost post** - Generate new post with Ghost properties template
- **Add Ghost properties to current note** - Add Ghost properties to existing note
- **Sync current note to Ghost** - Force sync of active file
- **Debug commands** - Show properties, test JWT, view file data

### YAML Frontmatter

Control all Ghost post metadata using YAML frontmatter:

```yaml
---
g_post_access: paid              # Visibility: public, members, or paid
g_published: false               # Draft (false) or published (true)
g_published_at: ""               # Schedule: ISO date (e.g., "2026-12-25T10:00:00.000Z")
g_featured: false                # Mark as featured post
g_tags: [obsidian, ghost]        # Post tags
g_excerpt: "Post summary"        # Custom excerpt/description
g_feature_image: ""              # Featured image URL
g_slug: "custom-url"             # Custom URL slug
g_no_sync: false                 # Disable sync for this post
---

# Your Post Title

Your post content here...
```

### Paywall marker

Control where the public preview ends for members-only posts. Add `--members-only--` on its own line anywhere in the post body:

```markdown
# My Post

This paragraph is visible to everyone.

--members-only--

This content is only visible to paying members.
```

- The marker is rendered as a styled banner in the Obsidian editor (uses your theme's accent color)
- Everything above the marker is the public preview; everything below is behind the Ghost paywall
- Only one marker is allowed — if you add a second one, the first is removed automatically
- Works together with `g_post_access: paid` or `g_post_access: members`

### Post Scheduling

Control when posts are published:

- **Draft**: `g_published: false` (ignores `g_published_at`)
- **Publish now**: `g_published: true` + `g_published_at: ""`
- **Schedule**: `g_published: true` + `g_published_at: "2026-12-25T10:00:00.000Z"` (future date)
- **Backdate**: `g_published: true` + `g_published_at: "2020-01-01T10:00:00.000Z"` (past date)

## Development

### Project Structure

```
ghost-writer-manager-plugin/
├── main.ts                 # Main plugin file
├── src/
│   ├── types.ts           # TypeScript interfaces
│   ├── ghost/
│   │   └── api-client.ts  # Ghost Admin API client
│   └── views/
│       └── calendar-view.ts  # Editorial calendar sidebar
├── styles.css             # Plugin styles
├── manifest.json          # Plugin manifest
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript config
```

### Commands

- `npm run dev` - Build in development mode with watch
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Development Mode

The plugin includes a `DEV_MODE` flag in `main.ts` that enables auto-sync on file changes:

```typescript
const DEV_MODE = true; // Set to false for production builds
```

**When `DEV_MODE = true`:**
- Files auto-sync 2 seconds after last change (debounced)
- Useful for testing during development

**When `DEV_MODE = false` (production):**
- Files only sync according to the configured interval
- Manual sync still available via commands

**Important:** Always set `DEV_MODE = false` before building for production/release.

## Roadmap

### ✅ Completed (v0.1.0)
- [x] Ghost API authentication (JWT with HMAC-SHA256)
- [x] Settings interface
- [x] Connection testing
- [x] One-way sync engine (Obsidian → Ghost)
- [x] YAML metadata control (full Ghost properties support)
- [x] Markdown to Lexical format conversion
- [x] Periodic sync (configurable interval)
- [x] Post scheduling system
- [x] Status bar indicator
- [x] Manual sync commands
- [x] Development mode with auto-sync (debounced)

### ✅ Completed (v0.2.0)
- [x] Editorial calendar sidebar view

### ✅ Completed (v0.2.7)
- [x] Paywall marker (`--members-only--`) with live editor decoration and auto-deduplication

### 🚧 Future Features
- [ ] Two-way sync (Ghost → Obsidian)
- [ ] Ghost pages support
- [ ] Media upload support
- [ ] Conflict resolution
- [ ] Bulk operations
- [ ] Post templates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/diegoeis/ghost-writer-manager-plugin/issues).





