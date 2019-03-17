[![CircleCI](https://circleci.com/gh/delta62/editcount.svg?style=svg)](https://circleci.com/gh/delta62/editcount)

# editcount

Break git commits into a stream of metadata objects, like this:

``` javascript
{
  hash: "",
  authorName: "Sam Noedel",
  authorEmail: "sam.noedel@example.com",
  timestamp: 123456789,
  filename: "test.ts",
  isCreated: true,
  isDeleted: false,
  isRename: false,
  additions: 42,
  deletions: 0
}
```

You can either access the data via a node `Readable` stream, or from an [rxjs observable](https://rxjs.dev).
If you want to invoke the library from the command line, check out [@noedel/commit-stats](https://github.com/delta62/commit-stats).

## Usage

```
yarn add @noedel/editcount
```

With an rxjs observable:

``` javascript
import { edits } from '@noedel/editcount'
// or import edits from '@noedel/editcount'

editStream({
  from '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6',
  to: '92e5030b918cc2a303de4f5056cde4506beb6eba',
  cwd: '/home/person/repo'
}).subscribe(
  console.log.bind(console),
  console.error.bind(console)
)
```

With a node `Readable` stream:

``` javascript
import { editStream } from '@noedel/editcount'

let stream = editStream({
  from '8a6b02108fc1ff9feb30a6c0405fca9600f9a4a6',
  to: '92e5030b918cc2a303de4f5056cde4506beb6eba',
  cwd: '/home/person/repo'
})

stream.on('data', console.log.bind(console))
stream.on('error', console.error.bind(console))
```

## License

MIT
