const faker = require('faker');
const childProcess = require('child_process');

const ipQty = Number(process.argv[2]) || 1000;

const chunk = (array, size) => {
    if (!array) return [];
    const firstChunk = array.slice(0, size); // create the first chunk of the given array
    if (!firstChunk.length) {
        return array; // this is the base case to terminal the recursive
    }
    return [firstChunk].concat(chunk(array.slice(size, array.length), size));
}

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {
    const array = new Array(ipQty).fill();

    const arrayChunks = chunk(array, 100)

    for (const currentChunk of arrayChunks) {
        await Promise.all(currentChunk.map(() => {
            return new Promise((resolve) => {
                const n = childProcess.fork(`${__dirname}/../scripts/ipGeolocation.js`, [faker.internet.ip()]);

                n.on('exit', (code, signal) => {
                    console.log(`child process exited with code ${code} and signal ${signal}`);
                    resolve();
                });
            });
        }));
        console.log('Chunk completed!');
        await sleep(500)
    }

    console.log('Seed finished!!');

    process.exit(0);
};

main();
