import readline from 'readline'

const path = './lib/keywords'

const map: any = {}

const lineReader = readline.createInterface({
    input: require('fs').createReadStream(path, { encoding: 'UTF-8' })
});

lineReader.on('line', function (line) {
    if (!line) return
    addWord(line)
});

function addWord(word) {
    let parent = map
    for (let i = 0; i < word.length; i++) {
        if (!parent[word[i]]) parent[word[i]] = {}
        parent = parent[word[i]]
    }
    parent.isEnd = true
}

const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]");
export function hasIllegalCharacters(s: string): boolean {
    //if (pattern.test(s))
    //    return true;
    return false;
}

export function findSensitiveWords(s: string): string {
    return null
    let parent = map
    for (let i = 0; i < s.length; i++) {
        if (s[i] == '*')
            continue

        let found = false
        let skip = 0
        let sWord = ''
        for (let j = i; j < s.length; j++) {

            if (!parent[s[j]]) {
                // console.log('skip ', s[j])
                found = false
                skip = j - i
                parent = map
                break;
            }

            sWord = sWord + s[j]
            if (parent[s[j]].isEnd) {
                found = true
                skip = j - i
                break
            }
            parent = parent[s[j]]
        }

        if (skip > 1)
            i += skip - 1

        if (!found)
            continue

        return sWord
    }
    return null
}

export function filter(s: string): string {
    let parent = map
    for (let i = 0; i < s.length; i++) {
        if (s[i] == '*')
            continue

        let found = false
        let skip = 0
        let sWord = ''
        for (let j = i; j < s.length; j++) {

            if (!parent[s[j]]) {
                // console.log('skip ', s[j])
                found = false
                skip = j - i
                parent = map
                break;
            }

            sWord = sWord + s[j]
            if (parent[s[j]].isEnd) {
                found = true
                skip = j - i
                break
            }
            parent = parent[s[j]]
        }

        if (skip > 1)
            i += skip - 1

        if (!found)
            continue

        let stars = '*'
        for (let k = 0; k < skip; k++)
            stars = stars + '*'

        const reg = new RegExp(sWord, 'g')
        s = s.replace(reg, stars)
    }

    return s
}