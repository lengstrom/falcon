#include <iostream>

int ALPHABETLENGTH = 123;

extern "C" {
    void buildBMSTable(char * pat, int * memo) {
        //printf("%s", pat);
        // printf("%d", memo[0]);
        std::cout << "New: " << pat << std::endl;
        std::cout << memo[0] << std::endl;
        memo[1] = 2;
    }
}

/* extern "C" { */
/*     int BMSMatch(char * pat, char * text, int * memo) { */
/*         int patLen = strlen(pat); */
/*         int textLen = strlen(text); */
/*         int w = patLen - 1; */
/*         int shift; */
    
/*         while (w < textLen) { */
/*             shift = 0; */
/*             while (text[w - shift] == pat[patLen - 1 - shift]) { */
/*                 shift += 1; */
/*                 if (patLen == shift) { */
/*                     return 1; */
/*                 } else { */
/*                     break; */
/*                 } */
/*             } */
/*             w += memo[w]; */
/*         } */

/*         return 0; */
/*     } */
/* } */
