#include <stdlib.h>
#include <string.h>
#include <stdio.h>

int ALPHABETLENGTH = 123;

void buildBMSTable(char * pat, int * memo) {
    memo[0] = 1;
    int patLen = strlen(pat);
    int i;
    printf("%s", pat);
    for (i = 0; i < ALPHABETLENGTH; i++) {
        memo[i] = patLen;
    }

    for (i = 0; i < patLen - 1; i++) {
        memo[pat[i]] = patLen - i - 1;
    }
}

int BMSMatch(char * pat, char * text, int * memo) {
    int patLen = strlen(pat);
    int textLen = strlen(text);
    int w = patLen - 1;
    int shift;
    
    while (w < textLen) {
        shift = 0;
        while (text[w - shift] == pat[patLen - 1 - shift]) {
            shift += 1;
            if (patLen == shift) {
                return 1;
            } else {
                break;
            }
        }
        w += memo[w];
    }

    return 0;
}
