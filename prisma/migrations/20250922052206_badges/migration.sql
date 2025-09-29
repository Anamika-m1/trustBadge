/*
  Warnings:

  - A unique constraint covering the columns `[shop,imageUrl]` on the table `Badges` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Badges_shop_imageUrl_key" ON "public"."Badges"("shop", "imageUrl");
