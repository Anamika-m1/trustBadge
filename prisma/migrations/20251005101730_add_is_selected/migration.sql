-- DropIndex
DROP INDEX "Badges_shop_imageUrl_key";

-- AlterTable
ALTER TABLE "Badges" ADD COLUMN     "isSelected" BOOLEAN NOT NULL DEFAULT false;
