# flv-demux

## 0. Required
> node v6-

## 1. Support Format
1. Video: only AVC
2. Audio: only AAC

## 2. Run Test
> cd test && node index.js

## 3. How To Use It
```javascript
    const FlvDemux = require('flv-demux');
    let decoder = new FlvDemux.Decoder();

    decoder.on('header', header => {
        // get flv header info
    });

    decoder.on('tag', tag => {
        switch(tag.type){
            case FlvDemux.DataTag.TYPE:
            // get onMetaData info
            break;
            case FlvDemux.AudioTag.TYPE:
            // get audio info
            break;
            case FlvDemux.VideoTag.TYPE:
            // get video info
            break;
        }
    });

    // you can decode buffer again
    decoder.decode(buffer);

    setTimeout(()=>{
        decoder.destroy();
    }, 5000);
```

## 4. TODO LIST
1. add browser support
2. improve performance furtherly