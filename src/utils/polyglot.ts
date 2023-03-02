import { stringFormat } from "./string"

export const englishMessages ={
    未分配路由: "Unassigned request",
}

export const langs = {
    en: englishMessages,
    english: englishMessages,
}

/** 获取翻译文本 */
export function getLang(text: string, lang: string = 'en', ...args: any[]): string {
    lang = lang.toLowerCase()
    if (lang != 'chinese') {
        const list = langs[lang] ?? langs.en
        text = list[text] ?? text
    }
    if (args.length > 0)
        text = stringFormat(text, ...args.map(v => getLang(v, lang)))
    return text
}