# 🏠 Home Depot Schedule → iCloud Calendar Sync

Automatically downloads your schedule from Workforce Tools (MyTHDHR) as a PDF,
parses your shifts, and syncs them to your iCloud Calendar — every day at 6 AM,
silently in the background.

---

## How it works

```
Mac (6 AM daily)
    │
    ▼
Playwright (headless Chrome)
    │  logs in to mythdhr.com
    ▼
Downloads Schedule PDF
    │
    ▼
pdfplumber parses shifts
    │  extracts dates, start/end times, department
    ▼
CalDAV → iCloud Calendar
    │  adds or updates events (no duplicates)
    ▼
✅ Your iCloud calendar is up to date
```

**Credentials** are stored in macOS Keychain — never in plain text files.

---

## Setup (do this once)

### 1. Download / place files

Put the entire `hd_schedule_sync/` folder somewhere permanent, e.g.:

```
~/Documents/hd_schedule_sync/
```

### 2. Run the installer

```bash
cd ~/Documents/hd_schedule_sync
chmod +x setup.sh install_launchd.sh
./setup.sh
```

This installs Python dependencies and the headless Chromium browser.

### 3. Get an iCloud App-Specific Password

iCloud requires an **App-Specific Password** for CalDAV (not your regular Apple ID password).

1. Go to [appleid.apple.com](https://appleid.apple.com)
2. Sign in → **Sign-In and Security** → **App-Specific Passwords**
3. Click **+** → name it "HD Schedule Sync" → copy the password

### 4. Run the setup wizard

```bash
source .venv/bin/activate
python3 hd_schedule_sync.py --setup
```

You'll be prompted for:
- Home Depot username & password
- iCloud Apple ID & App-Specific Password
- Calendar name (default: `Work Schedule`)
- Timezone (default: `America/Toronto`)

Everything is saved securely to **macOS Keychain**.

### 5. Test it manually

```bash
source .venv/bin/activate
python3 hd_schedule_sync.py
```

Check your iCloud Calendar — shifts should appear within seconds.

### 6. Install the daily auto-run

```bash
./install_launchd.sh
```

The sync will now run automatically every morning at **6:00 AM**.

---

## Manual run anytime

```bash
# Option A: direct
source ~/Documents/hd_schedule_sync/.venv/bin/activate
python3 ~/Documents/hd_schedule_sync/hd_schedule_sync.py

# Option B: via launchd
launchctl start com.homedepot.schedulesync
```

---

## Logs

```bash
tail -f ~/Documents/hd_schedule_sync/sync.log
```

---

## Troubleshooting

### "No shifts found" / wrong format
The script saves `debug_pdf_text.txt` with the raw text extracted from the PDF.
Open it and look at the format. If it doesn't match the expected patterns,
open an issue or edit the `parse_shifts()` function in `hd_schedule_sync.py`.

### Login fails / screenshot saved
Check `error_screenshot.png` to see what the browser saw.
Home Depot may have updated their login flow (Okta SSO, MFA, etc).

### iCloud 401 Unauthorized
Make sure you're using an **App-Specific Password**, not your regular Apple ID password.

### Keychain prompt on first run
macOS may ask you to allow keychain access. Click **Always Allow**.

---

## Files

| File | Purpose |
|------|---------|
| `hd_schedule_sync.py` | Main script |
| `config.json` | Non-secret config (calendar name, timezone) |
| `setup.sh` | Installs Python dependencies |
| `install_launchd.sh` | Installs daily auto-run |
| `com.homedepot.schedulesync.plist` | launchd template |
| `sync.log` | Run log |
| `debug_pdf_text.txt` | PDF text dump (created on parse failure) |
| `error_screenshot.png` | Browser screenshot (created on login failure) |

---

## Security notes

- Passwords are stored in **macOS Keychain** only — never written to disk in plain text
- `config.json` contains only your username and preferences
- The headless browser runs locally on your Mac
- No data leaves your machine except to Home Depot and iCloud's own servers

---

## Uninstall

```bash
# Remove daily auto-run
launchctl unload ~/Library/LaunchAgents/com.homedepot.schedulesync.plist
rm ~/Library/LaunchAgents/com.homedepot.schedulesync.plist

# Remove keychain entries
python3 -c "import keyring; keyring.delete_password('homedepot_schedule_sync', 'YOUR_HD_USERNAME')"
python3 -c "import keyring; keyring.delete_password('homedepot_schedule_sync_icloud', 'YOUR_ICLOUD_EMAIL')"

# Delete the folder
rm -rf ~/Documents/hd_schedule_sync
```
