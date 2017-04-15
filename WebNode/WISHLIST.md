# WebNode Wishlist

## Configuration
  - [ ] Global settings, fallback if lower levels not customized
  - [ ] Several news servers, per-server settings
  - [ ] Several identities
    + [ ] Assignable to server profiles
    + [ ] Assignable to individual newsgroups
  - Export/Import to/from JSON/XML (YAML?):
    + [ ] Settings
    + [ ] Local Storage (to change host)

## Newsgroups

  - Subscription
    + [ ] Subscribe to newsgroup, filter by name
    + [ ] Allow to unsubscribe from removed newsgroup, check regularly
    + [ ] Remove canceled postings, automatic oder manually; customizable
    + [ ] Per-newsgroup settings
    + [ ] Use newsgroup on another server:
      * [ ] Attempt to transfer messages based on `Message-ID` (old MID, new article #)

  - Display
    + [ ] Group by server or not, customizable
    + [ ] Shorten newsgroup name, customizable
    + [ ] Display as list or tree, customizable
    + [ ] Sort newsgroups subscribed to by name by default, customizable
    + [ ] Group newsgroups by custom topics
    + [ ] Filter newsgroups subscribed to by name
    + [ ] Highlight newsgroups with new postings
    + [ ] Highlight newsgroups with follow-ups to own postings

## Postings

  - Access:
    + [ ] Check for new postings, customizable
      * [ ] Display notice for new follow-ups to own postings, customizable:
        - `From`
        - `Subject`
        - `Newsgroups`
        - [ ] Link to follow-up
    + [ ] Scorefile
      * [ ] Score by any header field
      * [ ] Show how score for a posting was calculated, allow to update scorefile

  - Display:
    + [ ] Display as list or tree, customizable, remember for newsgroup
    + [ ] Group postings from different newsgroups by tags
    + [ ] Move to next unread posting by space if on end of current one, customizable
    + [ ] Keep track of read postings across newsgroups (crossposts)
    + [ ] Header fields, customizable
    + [ ] Font family, customizable
    + [ ] Word wrap, customizable:
      * [ ] Hyphenation
      * [ ] URIs
    + ROT-13 support:
      * [ ] Toggle posting
      * [ ] Mark parts
      * [ ] Automatically recognize parts(?) [see Edit]

  - Edit:
    + [ ] Allow to fix `Subject` created by broken newsreaders/unintentionally;
      normal `Subject` change is

          <subject1>
          Re: <subject1>
          <subject2> (was: <subject1>)
          Re: <subject2>

      Warn about divergent changes either by precursor or current author,
      allow to fix before posting. (Thanks to Michael Bäuerle)

      * [ ] Fix UTF-8-encoded `Subject` broken by ISO-8859-1 encoding with
        `decodeURIComponent(escape(…))`; (Thanks to Stefan Ram)

    + [ ] Warn if `Followup-To` has been set (and not announced), customizable
    + [ ] Word wrap, customizable:
      * [ ] Hyphenation
      * [ ] URIs
    + Spell check
      * [ ] Enable/disable built-in spell check
        - [ ] Enable/disable temporarily with checkbox
      * [ ] Set language of text
        - [ ] Set language of part of text
    + [ ] Autocomplete newsgroup names, customizable
      * [ ] Make `<news:…>` URIs for newsgroup names, customizable
    + [ ] Paste as quotation, customizable
    + [ ] Paste as box, customizable
    + [ ] Add quotation level, customizable
    + [ ] Add box, customizable
    + [ ] Mark for wrap or no-wrap, preserve quotation/box
    + ROT-13 support
      + [ ] Encode marked parts
      + [ ] Enclose encoded parts in tags, customizable
    + [ ] Add spoiler space, customizable
    + [ ] Automatically insert notice for crossposts w(/o) `Followup-To`, customizable
    + [ ] Automatically insert signature, customizable
    + [ ] Add tags to postings (`X-Tags`)

  - Submit:
    + [ ] Recognize unquoted phrases like “X-Post & F'up2” in message body
      to set header fields
    + [ ] Make `<news:…>` URIs for newsgroup names, customizable
    + [ ] Autocomplete newsgroup names in `Newsgroups` and `Followup-To`
      header field
    + [ ] Allow to select newsgroups for X-Post & F'up2 from list
    + [ ] Add custom header fields
      * [ ] Add `X-Face` and `Face`, generatable from uploaded image
      * [ ] Generate `Message-ID`, customizable
      * [ ] Generate `Cancel-Lock`, customizable
    + [ ] Digitally sign posting, customizable (warn about inline signing)
    + [ ] Warn before crosspost without `Followup-To`, customizable
    + [ ] Warn before posting to different newsgroup, customizable
    + [ ] Warn before crosspost to unsubscribed newsgroup, customizable;
      allow to subscribe
    + [ ] Warn before F'up2 to unsubscribed newsgroup, customizable;
      allow to subscribe
    + [ ] Display server message if posting fails
      * [ ] Allow to append non-empty lines if bad quote/non-quote ratio could be the reason; avoid spam (only for e.g. 10 lines more quotes
      than non-quotes, customizable)  

  - Archive:
    + [ ] Hold selected postings in Local Storage, customizable
      * [ ] Store base64-encoded to save space?
    + [ ] Archive selected postings in Local Storage, display in folders
    + [ ] Save/Restore posting to/from file (formats: Plain text, JSON/XML (YAML?)
    + [ ] Access (existing) posting archive in mbox and maildir format
