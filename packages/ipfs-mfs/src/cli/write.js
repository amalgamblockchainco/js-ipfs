'use strict'

const {
  asBoolean,
  asOctal,
  asDateFromSeconds
} = require('./utils')

module.exports = {
  command: 'write <path>',

  describe: 'Write to mfs files',

  builder: {
    parents: {
      alias: 'p',
      type: 'boolean',
      default: false,
      describe: 'Create any non-existent intermediate directories'
    },
    create: {
      alias: 'e',
      type: 'boolean',
      default: false,
      coerce: asBoolean,
      describe: 'Create the file if it does not exist'
    },
    offset: {
      alias: 'o',
      type: 'number',
      describe: 'Start writing at this offset'
    },
    length: {
      alias: 'l',
      type: 'number',
      describe: 'Write only this number of bytes'
    },
    truncate: {
      alias: 't',
      type: 'boolean',
      default: false,
      coerce: asBoolean,
      describe: 'Truncate the file after writing'
    },
    'raw-leaves': {
      alias: 'r',
      type: 'boolean',
      default: false,
      coerce: asBoolean,
      describe: 'Whether to write leaf nodes as raw UnixFS nodes'
    },
    'reduce-single-leaf-to-self': {
      type: 'boolean',
      default: false,
      coerce: asBoolean,
      describe: 'If a file can fit in one DAGNode, only use one DAGNode instead of storing the data in a child'
    },
    flush: {
      alias: 'f',
      type: 'boolean',
      default: true,
      coerce: asBoolean,
      describe: 'Flush the changes to disk immediately'
    },
    strategy: {
      alias: 's',
      type: 'string',
      default: 'balanced'
    },
    'cid-version': {
      alias: ['cid-ver'],
      type: 'number',
      default: 0,
      describe: 'Cid version to use'
    },
    'hash-alg': {
      alias: 'h',
      type: 'string',
      default: 'sha2-256'
    },
    'shard-split-threshold': {
      type: 'number',
      default: 1000,
      describe: 'If a directory has more links than this, it will be transformed into a hamt-sharded-directory'
    },
    mode: {
      type: 'int',
      coerce: asOctal,
      describe: 'The mode to use'
    },
    mtime: {
      alias: 'm',
      type: 'date',
      coerce: asDateFromSeconds,
      describe: 'Time to use as the new modification time'
    }
  },

  handler (argv) {
    const {
      path,
      getIpfs,
      getStdin,
      offset,
      length,
      create,
      truncate,
      rawLeaves,
      reduceSingleLeafToSelf,
      cidVersion,
      hashAlg,
      parents,
      progress,
      strategy,
      flush,
      shardSplitThreshold,
      mode,
      mtime
    } = argv

    argv.resolve((async () => {
      const ipfs = await getIpfs()

      await ipfs.files.write(path, getStdin(), {
        offset,
        length,
        create,
        truncate,
        rawLeaves,
        reduceSingleLeafToSelf,
        cidVersion,
        hashAlg,
        parents,
        progress,
        strategy,
        flush,
        shardSplitThreshold,
        mode,
        mtime
      })
    })())
  }
}
