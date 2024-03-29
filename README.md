# bahai-browser

This web app is for browsing the Bahá'í Writings and related texts.

See the [web app in action](https://bahai-browser.org/) or see some videos
[introducing the app](https://bahai-library.com/zamir_textbrowser_bahaiwritings_browser).

**Please note that while the website is functioning, this code is currently under construction as we attempt to break up the constituent code into separate reusable repositories. The history of the project prior to construction is under the [bahaiwritings](https://github.com/bahaidev/bahaiwritings) project, but that project is now going to be reserved for the Bahá'í Writings only.**

Although the [TextBrowser](https://github.com/bahaidev/textbrowser)
project for which this repository includes content is open sourced under
the MIT license (as is the specific JSON formatting (and schema and
meta-data files) of this repository), the contents of this data
repository are under their own licenses and their copyright is
retained. The usage terms of the Baha'i Writings are described
at <http://www.bahai.org/legal>. The Qur'an and Bible translations
(Rodwell/Sale and the King James) as well as the notes of Sale
and Rodwell are in the public domain. The Baha'i translation
cross-references are under the MIT license. *Lights of Guidance*
is under its own copyright as is the *Collins* bibliography.

## Installation

```shell
npm install bahai-browser
```

## To-dos

1.  Waiting: It is hoped that the addition of these tables (which are
    Scriptures) can also be automatically generated from any possible
    future authoritative API

    1.  Suggest API to Baha'i World Centre to automatically (and
        periodically) parse their texts into JSON here to ensure we
        have the most up-to-date and corrected translations

1.  Integrate with Steven Phelps' [inventory](http://blog.loomofreality.org/)
    of the Writings; could add a single link to the metadata for whole works,
    but especially useful for the by-verse annotations (its links to musical
    interpretation of individual Hidden Words; of course, Bahai9.com could
    also link to them).

1.  Make ***iframes responsive***
    <https://blog.theodo.com/2018/01/responsive-iframes-css-trick/>

1.  Use <https://github.com/sapegin/shipit> against a hidden config file
    to auto-deploy to <https://bahai-browser.org>

1.  Customize which voices get used

1.  Ability to bind plugin language dynamically at run-time rather than JSON,
    so any field can be translated

1.  Add plugin using such as <https://github.com/recogito/recogito-js> for
    inline, and more range-flexible annotations, using [adapter](https://github.com/jankaszel/recogito-web-annotation-adapter)
    that works with W3C-standard [Web Annotations](https://w3c.github.io/web-annotation/);
    also is a [validator](https://www.npmjs.com/package/validate-web-annotation).

    1. Could create a corresponding server, including possibly as a Mediawiki
        extension which provided a CRUD adapter for Web Annotations to/from
        MW API calls (including [login](https://www.mediawiki.org/wiki/API:Login))
        which allowed loading/updating content from within
        a wiki (or say a User subpage or maybe Wikidata) as the basis for
        the annotations. As wikidata can be federated, could have a dedicated
        user wiki for user annotations separate from a more formal, offical
        one for more general purpose data.

1.  Use Wikidata.org language data to transform Arabic (or Persian) to root
    words for **dictionary** look-up (if not Wiktionary or
    Wikidata->Wikipedia->language link mapping, then any other free dictionary
    we might find)

1.  Upon update completion have service worker read from the (latest
    section of) `CHANGES.md`

1.  Add more Cypress tests?

1.  Add disableable "Powered by TextBrowser" message on non-results pages with
    link to that repo.

1.  Break out plugins into separate repository(ies) for reusability
    with textbrowser (and publicize their presence on its wiki).

    1. Make (modular) plugin schemas

    1. Change wikilinks to be able to make post-load (CORS?) HEAD
      detection of `Last-Modified` as with
      [BADIPagesCreatedLinks](https://github.com/brettz9/BADIPagesCreatedLinks),
      so can style uncreated links in orange and make own cache; or
      to avoid multiple repeat requests, query a central cache (even
      an API to `BADIPagesCreatedLinks`).

    1. Allow plugins to be reused multiple times with different metadata

1.  Apply <https://www.gnu.org/software/librejs/free-your-javascript.html>
    labels to provide machine-automated detection of (open source) licenses.

1.  ONGOING:

    1. Once stabilized, target `TextBrowser` dependency by tagged
        version.

    1.  Ensure `notextbrowser` branch is kept up to date with `master`
        besides the `package.json` and absent HTML/JavaScript/CSS differences.

    1.  Ensure still passing tests/validating

    1.  Once `TextBrowser` version stabilizes, target "textbrowser"
        dependency by tagged version instead of `master`.

1.  See TextBrowser to-dos

1.  Fix tooltip when showing just 2 columns (Arabic goes too far to right)

1.  Actually update `notextbrowser` branch and tag this version when stable

1.  Add/change data files and meta-data files to use `$schema`?

1.  Fix TextBrowser so it can load with a port in `npm start`

1.  Change schema references (in both `bahaiwritings` branches) to point
    to absolute URLs so as to be independent of repository/branch (rather
    than their current assumption of being utilized within `TextBrowser`).

1.  Look at backlinks for templates like `{{pup|}}` to find the pages which
    reference a book, and then look for the heading above those quotes, so
    as to insert summary headings next to paragraphs as we do for the
    Kitáb-i-Aqdas indexes. Could also just use WhatLinksHere backlinks to
    include the title of the page on which it was cited.

1.  Add/Add back references for automated:

    1.  Synopsis, Roman numerals (pm, gwb), Chinese numbers, word-by-word
        translation (Persian/Arabic/German/English) with ruby-style
        annotations above the word and/or tooltip option, auto-romanized
        Persian (Baha'i-style with help link to
        <http://bahai9.com/wiki/Pronunciation>), Persian with English
        tooltips, English with Persian tooltips,
        text-to-(Google search, Google define, Wikipedia, bahai9.com
        edit pages); add Word-by-word/phrase mapping

    1.  Make a version for the [Browser API](https://developer.mozilla.org/en-US/docs/Web/API/Using_the_Browser_API)
        to enable side-by-side views of (Bahai9.com) iframes dedicated to a
        given verse/paragraph!

1.  Specific works - See [bahaiwritings](https://github.com/bahaidev/bahaiwritings)

1.  Lower priority

    1.  Add any other reasonable `browse_options`
    1.  Add "By page" for the Aqdas (once parsed by page)
    1.  Further localization including column aliases, etc.
    1.  [Baha'i Bot](https://github.com/bahaidev/bahaibot) for Discord?
    1.  Idea for plugin to add links to a Calendar/Task API (no web standard
        yet apparently)

## Testing

You will first need to run `npm install`.

The syntax used in the tests currently only works in a modern browser.
Note that this may lock up your terminal as the validator must load and
process all of the files (including child files):

```shell
npm test
```

Note that the tests currently only perform schema validation. We do not
yet have full UI tests though these can be run with:

```shell
npm run browser-test
```

If you merely wish to see the app running in a server, you can run:

```shell
npm run server
```

## Background

For background of this project, see *TextBrowser*'s History section.

## Justification

While there was a letter from the international governing body of the
Bahá'í Faith (online at
<http://bahai-library.com/uhj_interlinear_writings_cta>), suggesting
that interlinear publications are not necessary for the Bahá'í Writings,
I do not think that this guidance pertains to our project for the following
reasons:

- The context appears to be more about official print publications which
would need to justify resources being spent on such specialized text versions.
The original question refers to Publishing Trusts and the response speaks of
"all other readers" (besides those comparing with the Persian/Arabic originals)
being distracted, whereas online, there are minimal (and non-official)
resources being spent to provide the works, so there is no concern for
distraction of other readers (and those using our *TextBrowser*-based tool
can indeed selectively disable any column they wish).

- Besides allowing those already familiar with English (or other translations)
and Arabic/Persian, to confirm the original meaning, the availability of such
interlinear tools allows for comparison by language learners who, although
as per the letter, learning the original language is not required in the
Bahá'í Faith, the learning of the original is very much praised as evident in
the quotations at <https://bahai9.com/wiki/Persian> and <https://bahai9.com/wiki/Arabic>.

- Our software tool is not confined to displaying translations multilinearly.
For example, the version of the Qur'án herein included also provide notes
which can be viewed interlinearly (from translators whose works were, at least
for the time when translations into English were not as abundant, [recommended
for use or study by Bahá'ís](http://bahai-library.com/quran_rodwell_sale_zamir#B.%20Quotations%20in)),
and study of such notes was even [recommended by Shoghi Effendi](https://bahai9.com/wiki/Qur'%C3%A1n#How_to_Study_the_Qur.27.C3.A1n).
More such non-translation fields, including automated ones, are planned. And
the tool can even be used for viewing merely the paragraph number and a single
language of text. (While the notes of Rodwell were not recommended, and are
indeed often antagonistic or skeptical of His Holiness Muhammad, they are
provided largely for the sake of Biblical cross-references, and can be selectively
omitted from view.)
