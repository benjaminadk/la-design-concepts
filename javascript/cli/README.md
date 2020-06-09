# LADC CLI

A comprehensive command line tool built for L.A. Design Concepts that offers file system utilities, SEO/SERP analytics, Nginx redirect formatter, sitemap creator, image editting and screenshot testing.

## Installation

Clone repository
`git clone https://github.com/benjaminadk/la-design-concepts.git`

Navigate to CLI directory
`cd la-design-concepts/javascript/cli`

Install dependencies
`npm install`

Link the `ladc` command to your local machine
`npm link`

## Usage

- `ladc` is the main command and begins all uses of this tool
- Add a subcommand and options to control functionality

| Sub Command |                                   Description                                    |
| :---------: | :------------------------------------------------------------------------------: |
|    `fbj`    |       Filter huge directory or image files using a JSON list for targeting       |
|    `img`    |     Manipulate a directory of images to be 800 x 800 or 225 x 190 thumbnails     |
|    `ss`     |    Takes screenshots of brand pages in desktop, tablet or mobile screen size     |
|    `seo`    |       Automated Google keyword search and reports our organic/paid results       |
|   `unpk`    | Unpacks a nested folder structure and copies all files into one top level folder |
|    `ff`     |         Formats a directory of image filenames to our naming conventions         |
|    `dli`    |                  Download a list of image urls using a TXT file                  |
|   `smap`    |                     Generate a sitemap based on list of URLs                     |
|   `index`   |         Uses Google Index API to request indexing of a TXT list of URLs          |
| `redirect`  |                Create Nginx 301 redirects from array of 404 URLs                 |
|  `rename`   |           Rename a directory of files based on a JavaScript object map           |
|    `lss`    |           Create a TXT file listing all files in the current directory           |

Most subcommands accept options. These are mostly to designate a source and destination directory for input and output. To see a particular subcommand's options:

```
ladc [subcommand] --help
```

## Subcommand Options

🚧 Under Construction
