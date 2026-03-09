import sqlite3

# The database code 
connection = sqlite3.connect("test.db")
cursor = connection.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS clothing_item (
        id INTEGER PRIMARY KEY,
        category TEXT NOT NULL CHECK(category IN ('top', 'bottom')),
        item_type TEXT NOT NULL,
        color TEXT NOT NULL
    )
""")
cursor.execute("""
    CREATE TABLE IF NOT EXISTS outfit (
        id INTEGER PRIMARY KEY,
        top_id INTEGER NOT NULL,
        bottom_id INTEGER NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(top_id) REFERENCES clothing_item(id),
        FOREIGN KEY(bottom_id) REFERENCES clothing_item(id)
    )
""")

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

        cursor.execute("INSERT INTO clothing_item (category, item_type, color) VALUES (?, ?, ?)", (category, item_type, color))

        connection.commit()
        print ("Clothing item added successfully!")

        answer = get_input(main_menu)
        
    elif answer == "2":
    # Retrieve and display all clothing items from the database
    # Test to verify that the item was added correctly2

        print("Showing database items...")

        cursor.execute("SELECT * FROM clothing_item")

        rows = cursor.fetchall()

        for row in rows:
            print(row)
        
        answer = get_input(main_menu)
        
    elif answer == "3":

        cursor.execute("SELECT id FROM clothing_item")

        rows = cursor.fetchall()

        print("Available item IDs:")

        for row in rows:
            print(row[0])

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
        cursor.execute("DELETE FROM clothing_item WHERE id = ?", (item_id,))
        connection.commit()
        print("Item deleted successfully!")

        answer = get_input(main_menu)

    elif answer == "4":
        cursor.execute("SELECT id FROM clothing_item WHERE category = 'top'")
        top_rows = cursor.fetchall()
        print("Available tops:")
        for row in top_rows:
            print(row[0])
        top_id = get_input("Enter the ID of the top you want to use: ")
        if not top_id.isdigit():
            print("Invalid ID. Please enter a numeric value.")
            continue
        if int(top_id) not in [row[0] for row in top_rows]:
            print("Top ID not found. Please enter a valid ID.")
            continue    
        
        cursor.execute("SELECT id FROM clothing_item WHERE category = 'bottom'")
        bottom_rows = cursor.fetchall()
        print("Available bottoms:")
        for row in bottom_rows:
            print(row[0])
        bottom_id = get_input("Enter the ID of the bottom you want to use: ")
        if not bottom_id.isdigit():
            print("Invalid ID. Please enter a numeric value.")
            continue
        if int(bottom_id) not in [row[0] for row in bottom_rows]:
            print("Bottom ID not found. Please enter a valid ID.")
            continue
        
        cursor.execute("INSERT INTO outfit (top_id, bottom_id) VALUES (?, ?)", (top_id, bottom_id))
        connection.commit()
        print("Outfit created successfully!")

        outfit_answer = get_input("Press 1 to show all outfits "
                            "press anything else to return to main menu: ")
        if outfit_answer == "1":
            cursor.execute("SELECT id, top_id, bottom_id FROM outfit")
            outfits = cursor.fetchall()
            print("Showing all outfits...")
            for outfit in outfits:
                print(outfit)

        
        answer = get_input(main_menu)

    elif answer == "5":
        cursor.execute("SELECT id, top_id, bottom_id FROM outfit")
        outfits = cursor.fetchall()
        print("Showing all outfits...")
        for outfit in outfits:
            print(outfit)

        answer = get_input(main_menu)


else:
        print("Exiting...")
        connection.close()


