-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "clearedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "deletedBy" TEXT[] DEFAULT ARRAY[]::TEXT[];
