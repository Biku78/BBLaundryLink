package seeders

import "fmt"

func DatabaseSeeder() error {

	fmt.Println("Starting Database Seeding...")

	// User seeder
	if err := UserSeeder(); err != nil {
		return fmt.Errorf("user seeder failed: %w", err)
	}

	// Laundry seeder
	// if err := LaundrySeeder(); err != nil {
	//     return fmt.Errorf("laundry seeder failed: %w", err)
	// }

	// Service seeder
	// if err := ServiceSeeder(); err != nil {
	//     return fmt.Errorf("service seeder failed: %w", err)
	// }

	fmt.Println("Database Seeding Completed Successfully!")

	return nil
}
