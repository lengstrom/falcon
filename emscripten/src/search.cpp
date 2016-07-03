#include <iostream>
#include <string>
#include <assert.h>

const int ALPHABETLENGTH = 123;

extern "C" {
    void buildBMSTable(char * pat, int * memo) {
        int patLen = strlen(pat);
        int i;
        for (i = 0; i < ALPHABETLENGTH; i++) {
            memo[i] = patLen;
        }

        for (i = 0; i < patLen - 1; i++) {
            memo[pat[i]] = patLen - i - 1;
        }
    }
}

extern "C" {
    int BMSMatch(char * pat, char * text, int * memo) {
        int patLen = strlen(pat);
        int textLen = strlen(text);
        int w = patLen - 1;
        int shift;
    
        while (w < textLen) {
            shift = 0;
            while (patLen > shift && text[w - shift] == pat[patLen - 1 - shift]) {
                shift += 1;
                if (patLen == shift) {
                    return 1;
                }
            }
            w += memo[text[w]];
        }

        return 0;
    }
}
