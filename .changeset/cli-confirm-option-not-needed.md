---
'@astryx-vue/cli': patch
---

传 `--yes`、`-y`、`--non-interactive` 这类确认选项时，CLI 会说明所有命令都不会提问，并直接给出去掉该选项后的同一条命令；内置的使用原则文档改为「设置分组用 `Section`，不用 `Card`」。
