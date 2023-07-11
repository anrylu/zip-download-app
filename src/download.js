import streamSaver from 'streamsaver';
import { CreateZIPWriter } from './zip-stream'

export const downloadOne = async req => {
    const fileStream = streamSaver.createWriteStream(req.name, {
        size: req.size // Makes the percentage visiable in the download
      })
    const writer = fileStream.getWriter();
    const push = (start) => {
        let end = start + 1024*1024 - 1;
        if( end >= req.size ) end = req.size-1;
        const headers = {
            ...req.headers,
            'Range': `bytes=${start}-${end}`
        }; 
        fetch(req.url, {headers: headers}).then(async (resp) => { 
            let gg = await resp.arrayBuffer();
            writer.write(new Uint8Array(gg));
            if( end == (req.size-1) ) {
                writer.close()
            } else {
                setTimeout(() => {
                    push(end+1);
                }, 1);
            }
        });
    };
    push(0);
}

export const downloadMultiple = async reqs => {
    const fileStream = streamSaver.createWriteStream('archive.zip');
    const readableZipStream = new CreateZIPWriter({
        start (ctrl) {
            for(let i=0; i<reqs.length; i++ ) {
                const req = reqs[i];
                const f = {
                    name: req.name,
                    stream () {
                        return new ReadableStream({
                            start (ctrl) {
                                const push = (start) => {
                                    let end = start + 1024*1024 - 1;
                                    if( end >= req.size ) end = req.size-1;
                                    const headers = {
                                        ...req.headers,
                                        'Range': `bytes=${start}-${end}`
                                    }; 
                                    fetch(req.url, {headers: headers}).then(async (resp) => { 
                                        let gg = await resp.arrayBuffer();
                                        ctrl.enqueue(new Uint8Array(gg));
                                        if( end == (req.size-1) ) {
                                            ctrl.close()
                                        } else {
                                            setTimeout(() => {
                                                push(end+1);
                                            }, 1);
                                        }
                                    });
                                }
                                push(0);
                            }
                        })
                    }
                };
                ctrl.enqueue(f)
            }
            ctrl.enqueue({name: 'streamsaver-zip-example/empty folder', directory: true})
            ctrl.close()
        },
      });

      const writer = fileStream.getWriter()
      const reader = readableZipStream.getReader()
      const pump = () => reader.read()
        .then(res => res.done ? writer.close() : writer.write(res.value).then(pump))

      pump()

}