-- DropForeignKey
ALTER TABLE "ListMember" DROP CONSTRAINT "ListMember_list_id_fkey";

-- DropForeignKey
ALTER TABLE "ShoppingItem" DROP CONSTRAINT "ShoppingItem_list_id_fkey";

-- AddForeignKey
ALTER TABLE "ListMember" ADD CONSTRAINT "ListMember_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "ShoppingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShoppingItem" ADD CONSTRAINT "ShoppingItem_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "ShoppingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
