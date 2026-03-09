import services.services as services


services.database_setup()
connection, cursor = services.database_setup()

main_menu = ("Press 1 to add a clothing item "
"Press 2 to show all clothing items "
"Press 3 to delete a item "
"Press 4 to create an outfit "
"Press 5 to see outfits "
"press anything else to exit: ")

def get_input(prompt):
    value = input(prompt).lower()
    if value == "menu" or value == "main menu":
        return get_input(main_menu)
    return value
    
answer = get_input(main_menu)



# User Inputs
# Asks user for category, type, and color of clothing item and adds it to the database
while answer in ["1", "2", "3", "4", "5"]:
    
    if answer == "1":

        category = get_input("Enter category 1 for top 2 for bottom: ").lower()
        if category == "1":
            category = "top"
        elif category == "2":               
            category = "bottom"
        else:
            print("Invalid category. Please enter 1 for top or 2 for bottom.")
            continue

        item_type = get_input("Enter type of clothing: ").lower()

        color = get_input("Enter color: ").lower()

        services.add_clothing_item(category, item_type, color, cursor, connection)
        print ("Clothing item added successfully!")

        answer = get_input(main_menu)
        
    elif answer == "2":
    # Retrieve and display all clothing items from the database
    # Test to verify that the item was added correctly2


        print("Showing database items...")
        services. get_all_clothing_items(cursor)
        
        rows = services. get_all_clothing_items(cursor)

        for row in rows:
            print(row)

        answer = get_input(main_menu)
        
    elif answer == "3":

        services.get_item_id(cursor)

        print("Available item IDs:")
        
        rows = services.get_item_id(cursor)

        for row in rows:
            print(row)

        item_id = get_input("Enter the ID of the item you want to delete: ")

        if not item_id.isdigit():
            print("Invalid ID. Please enter a numeric value.")
            continue

        if int(item_id) not in [row[0] for row in rows]:
            print("Item ID not found. Please enter a valid ID.")
            continue

        confirm = get_input("Are you sure you want to delete this item? (Y/N): ").lower()

        if confirm != "y":
            print("Deletion cancelled.")
            continue

        print(f"Deleting item with ID: {item_id}...")

        services.delete_clothing_item(item_id, cursor, connection)

        services.commit_changes(connection)

        print("Item deleted successfully!")

        answer = get_input(main_menu)

    elif answer == "4":
        services.get_top_items(cursor)

        print("Available tops:")

        rows = services.get_top_items(cursor)

        for row in rows:
            print(row)

        top_id = get_input("Enter the ID of the top you want to use: ")

        if not top_id.isdigit():
            print("Invalid ID. Please enter a numeric value.")
            continue

        rows = services.get_top_items(cursor)
    
        if int(top_id) not in [row[0] for row in rows]:
            print("Top ID not found. Please enter a valid ID.")
            continue    
        services.get_bottom_items(cursor)

        print("Available bottoms:")

        rows = services.get_bottom_items(cursor)

        for row in rows:
            print(row)

        bottom_id = get_input("Enter the ID of the bottom you want to use: ")

        if not bottom_id.isdigit():
            print("Invalid ID. Please enter a numeric value.")
            continue

        rows = services.get_bottom_items(cursor)  

        if int(bottom_id) not in [row[0] for row in rows]:
            print("Bottom ID not found. Please enter a valid ID.")
            continue
        
        services.create_outfit(top_id, bottom_id, cursor, connection)

        print("Outfit created successfully!")

        outfit_answer = get_input("Press 1 to show all outfits "
                            "press anything else to return to main menu: ")
        
        if outfit_answer == "1":
            services.get_outfits(cursor)
            print("Showing all outfits...")

            rows = services.get_outfits(cursor)

            for row in rows:
                print(row)

        
        answer = get_input(main_menu)

    elif answer == "5":
        services.get_outfits(cursor)

        print("Showing all outfits...")

        rows = services.get_outfits(cursor)
    
        for row in rows:
            print(row)

        answer = get_input(main_menu)


else:
        print("Exiting...")
        
        services.close_db_connection(connection)
