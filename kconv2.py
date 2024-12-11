import sys
from jamo import h2j, j2h, j2hcj

# utf8 to 3327 =======================================


# 3327 lang toggle key
ko = chr(11)
en = chr(1)
cr = chr(13)


# 3327: - ㄲ, = ㄸ, * ㅃ, < ㅆ, > ㅉ, + ㅖ, ; ㅒ

tbl3327 = list('ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ')
tbl3327_key = [
    'R', #ㄱ
    '-', #ㄲ
    'S', #ㄴ
    'E', #ㄷ
    '=', #ㄸ
    'F', #ㄹ
    'A', #ㅁ
    'Q', #ㅂ
    '*', #ㅃ
    'T', #ㅅ
    '<', #ㅆ
    'D', #ㅇ
    'W', #ㅈ
    '>', #ㅉ
    'C', #ㅊ
    'Z', #ㅋ
    'X', #ㅌ
    'V', #ㅍ
    'G', #ㅎ
    'K', #ㅏ
    'O', #ㅐ
    'I', #ㅑ
    ';', #ㅒ
    'J', #ㅓ
    'P', #ㅔ
    'U', #ㅕ
    '+', #ㅖ
    'H', #ㅗ
    'HK', #ㅘ
    'HO', #ㅙ
    'HL', #ㅚ
    'Y', #ㅛ
    'N', #ㅜ
    'NJ', #ㅝ
    'NP', #ㅞ
    'NL', #ㅟ
    'B', #ㅠ
    'M', #ㅡ
    'ML', #ㅢ
    'L', #ㅣ
    'R', #ㄱ
    '-', #ㄲ
    'RT', #ㄳ
    'S', #ㄴ
    'SW', #ㄵ
    'SG', #ㄶ
    'E', #ㄷ
    'F', #ㄹ
    'FR', #ㄺ
    'FA', #ㄻ
    'FQ', #ㄼ
    'FT', #ㄽ
    'FX', #ㄾ
    'FV', #ㄿ
    'FG', #ㅀ
    'A', #ㅁ
    'Q', #ㅂ
    'QT', #ㅄ
    'T', #ㅅ
    '<', #ㅆ
    'D', #ㅇ
    'W', #ㅈ
    'C', #ㅊ
    'Z', #ㅋ
    'X', #ㅌ
    'V', #ㅍ
    'G',  #ㅎ
]



def utf8_to_3327(s, addA2CR=False):    
    ret = ''
    mode = 'e'  # e:eng, k:kor    
    for c in s:
        code = ord(c)
        if code > 256: # korean
            if mode == 'e':
                ret += ko
                mode = 'k'
            jm1 = h2j(c)
            jm2 = j2hcj(jm1)
            try:
                for c1 in jm2:
                    idx3327 = tbl3327.index(c1)
                    key3327 = tbl3327_key[idx3327]
                    ret += key3327                
            except ValueError:
                ret += '*ERR*'
        else: # english
            if mode == 'k':
                ret += en
                mode = 'e'
            ret += c
            
    if mode == 'k':
        ret += en
    
    if addA2CR:
        ret += cr
    
    return ret
    


if __name__ == "__main__":
    sys.stdin.reconfigure(encoding='utf-8')
    sys.stdout.write(utf8_to_3327(sys.stdin.read()))

