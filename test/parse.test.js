const { expect } = require('chai')
const { CramFile } = require('../src')

const { fromUrl } = require('./lib/io')
const { testDataFile } = require('./lib/util')

describe('CRAM reader', () => {
  it('can read a cram file definition', async () => {
    const file = new CramFile(testDataFile('auxf#values.tmp.cram'))
    const header = await file.getDefinition()
    expect(header).to.deep.equal({
      magic: 'CRAM',
      majorVersion: 3,
      minorVersion: 0,
      fileId: '-',
    })
  })

  it('can read the first container header of a cram file', async () => {
    const file = new CramFile(testDataFile('auxf#values.tmp.cram'))
    const header = await (await file.getContainerByID(0)).getHeader()
    expect(header).to.deep.equal({
      alignmentSpan: 0,
      crc32: 2996618296,
      landmarks: [0, 161],
      length: 250,
      numBases: 0,
      numBlocks: 2,
      numLandmarks: 2,
      numRecords: 0,
      recordCounter: 0,
      _size: 19,
      _endOffset: 45,
      seqId: 0,
      start: 0,
    })
  })

  xit('can read a bigger cram file', async () => {
    const file = new CramFile(
      fromUrl('file:///Users/rbuels/dev/sample_data/insilico_21.cram'),
    )
    expect(await file.getDefinition()).to.deep.equal({
      fileId: '21_1mil.cram',
      magic: 'CRAM',
      majorVersion: 3,
      minorVersion: 0,
    })
    expect(await (await file.getContainerByID(0)).getHeader()).to.deep.equal({
      alignmentSpan: 0,
      crc32: 2977905791,
      _endOffset: 45,
      _size: 19,
      landmarks: [0, 3927],
      length: 5901,
      numBases: 0,
      numBlocks: 2,
      numLandmarks: 2,
      numRecords: 0,
      recordCounter: 0,
      seqId: 0,
      start: 0,
    })
  })
  xit('can read an even bigger cram file', async () => {
    const file = new CramFile(
      fromUrl(
        'file:///Users/rbuels/dev/sample_data/SGN/RNAseq_mapping_def.cram',
      ),
    )
    expect(await file.getDefinition()).to.deep.equal({
      fileId: '-',
      magic: 'CRAM',
      majorVersion: 3,
      minorVersion: 0,
    })
    expect(await (await file.getContainerByID(1)).getHeader()).to.deep.equal({
      alignmentSpan: 529350,
      crc32: 2139737710,
      _size: 24,
      _endOffset: 1178,
      landmarks: [990],
      length: 84878,
      numBases: 651833,
      numBlocks: 34,
      numLandmarks: 1,
      numRecords: 10000,
      recordCounter: 0,
      seqId: 0,
      start: 300,
    })
  })

  it('can read the second container header of a cram file', async () => {
    const file = new CramFile(testDataFile('auxf#values.tmp.cram'))
    const container = await file.getContainerByID(1)
    const header = await container.getHeader()
    expect(header).to.deep.equal({
      alignmentSpan: 20,
      crc32: 3362745060,
      _size: 18,
      _endOffset: 313,
      landmarks: [1042],
      length: 3031,
      numBases: 20,
      numBlocks: 52,
      numLandmarks: 1,
      numRecords: 2,
      recordCounter: 0,
      seqId: 0,
      start: 1,
    })
  })

  Object.entries({
    'auxf#values.tmp.cram': 3,
    'c1#bounds.tmp.cram': 3,
    'c1#clip.tmp.cram': 3,
    'c1#noseq.tmp.cram': 3,
    'c1#pad1.tmp.cram': 3,
    'c1#pad2.tmp.cram': 3,
    'c1#pad3.tmp.cram': 3,
    'c1#unknown.tmp.cram': 3,
    'c2#pad.tmp.cram': 3,
    'ce#1.tmp.cram': 3,
    'ce#1000.tmp.cram': 31,
    'ce#2.tmp.cram': 3,
    'ce#5.tmp.cram': 3,
    'ce#5b.tmp.cram': 5,
    'ce#large_seq.tmp.cram': 3,
    'ce#supp.tmp.cram': 3,
    'ce#tag_depadded.tmp.cram': 3,
    'ce#tag_padded.tmp.cram': 3,
    'ce#unmap.tmp.cram': 3,
    'ce#unmap1.tmp.cram': 3,
    'ce#unmap2.tmp.cram': 4,
    'headernul.tmp.cram': 3,
    'md#1.tmp.cram': 3,
    'sam_alignment.tmp.cram': 3,
    'xx#blank.tmp.cram': 2,
    'xx#large_aux.tmp.cram': 3,
    'xx#large_aux2.tmp.cram': 3,
    'xx#minimal.tmp.cram': 4,
    'xx#pair.tmp.cram': 3,
    'xx#repeated.tmp.cram': 3,
    'xx#rg.tmp.cram': 3,
    'xx#tlen.tmp.cram': 4,
    'xx#tlen2.tmp.cram': 4,
    'xx#triplet.tmp.cram': 4,
    'xx#unsorted.tmp.cram': 5,
  }).forEach(([filename, containerCount]) => {
    it(`can count ${containerCount} containers in ${filename}`, async () => {
      const file = new CramFile(testDataFile(filename))
      const count = await file.containerCount()
      expect(count).to.equal(containerCount)
    })
  })

  it('can read the compression header block and first slice header block from the 23rd container of ce#1000.tmp.cram', async () => {
    const file = new CramFile(testDataFile('ce#1000.tmp.cram'))
    const container = await file.getContainerByID(23)
    const containerHeader = await container.getHeader()
    expect(containerHeader).to.deep.equal({
      _endOffset: 108275,
      _size: 32,
      alignmentSpan: 0,
      crc32: 1355940116,
      landmarks: [383, 1351, 2299, 3242, 4208],
      length: 5156,
      numBases: 3500,
      numBlocks: 94,
      numLandmarks: 5,
      numRecords: 35,
      recordCounter: 770,
      seqId: -2,
      start: 0,
    })
    const {
      content: compressionBlockData,
      ...compressionBlock
    } = await container.getCompressionBlock()
    expect(compressionBlock).to.deep.equal({
      _size: 376,
      _endOffset: 108658,
      compressedSize: 372,
      contentId: 0,
      contentType: 'COMPRESSION_HEADER',
      compressionMethod: 'raw',
      uncompressedSize: 372,
      crc32: 1246026486,
    })
    expect(compressionBlockData).to.haveOwnProperty('tagEncoding')
    expect(compressionBlockData).to.haveOwnProperty('preservation')
    expect(compressionBlockData).to.haveOwnProperty('dataSeriesEncoding')
    expect(compressionBlockData).to.haveOwnProperty('_size')
    expect(compressionBlockData).to.haveOwnProperty('_endOffset')
    expect(compressionBlockData.preservation.mapSize).to.equal(61)
    expect(compressionBlockData.tagEncoding.mapCount).to.equal(9)
    expect(compressionBlockData.tagEncoding.entries.length).to.equal(9)
    expect(compressionBlockData.dataSeriesEncoding.mapSize).to.equal(150)
    expect(compressionBlockData.dataSeriesEncoding.mapCount).to.equal(21)
    expect(compressionBlockData.dataSeriesEncoding.entries).length(21)
    // expect(compressionBlockData.dataSeriesEncoding).to.deep.equal({})
    expect(compressionBlockData.preservation).to.deep.equal({
      mapSize: 61,
      mapCount: 4,
      entries: [
        {
          key: 'TD',
          value: {
            size: 44,
            entries: ['ASCXSCXNCXMCXOCXGCYTZ', 'AScXScXNCXMCXOCXGCYTZ'],
          },
        },
        { key: 'SM', value: [27, 27, 27, 27, 27] },
        { key: 'RN', value: true },
        { key: 'AP', value: false },
      ],
    })
  })
})
