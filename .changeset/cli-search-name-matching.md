---
'@astryx-vue/cli': patch
---

Improve search ranking for compound names, camelCase queries, and common word forms. Search now matches authored template display names, avoids unrelated partial-text results for underscored identifiers, and orders failed-lookup suggestions by name affinity before edit distance.
