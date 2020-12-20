import { deepStrictEqual } from "assert";

import * as finder from "../src";

it("ジャガイモの情報と子孫のツリー情報を返すべき", async () => {
  const item = finder.find("Potato");
  deepStrictEqual(
    item.parents.map(parent => parent.id),
    ["potato bread", "potato soup", "french fries", "baked potato", "butter-fried potatoes"]
  );
});

it("包帯", async () => {
  const item = finder.find("Bandage");
  deepStrictEqual(
    item.parents.map(parent => parent.id),
    ["patched robe", "squad leader armband", "bracer", "first aid kit", "oilcloth"]
  );
});

it("灰", async () => {
  const ash = finder.find("Ash");
});

it("致命を検索", async () => {
  const found = finder.findAll({ stats: /healing reduction/ });
  console.log(found);
  // const common = finder.findAll({ rarity: 1, type: "material" });
  // console.log(common);
});
