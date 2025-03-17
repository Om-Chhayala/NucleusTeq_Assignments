import java.util.Scanner;

public class Temperature_Conversion {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Choose conversion 1 for Celsius to Fahrenheit and 2 for Fahrenheit to Celsius : ");
        int conversion = sc.nextInt();

        if (conversion == 1) {
            System.out.print("Enter temperature in Celsius: ");
            double celsius = sc.nextDouble();
            double fahrenheit = (celsius * 9 / 5) + 32;
            System.out.printf("Temperature in Fahrenheit: %.2f\n", fahrenheit);
        } else if (conversion == 2) {
            System.out.print("Enter temperature in Fahrenheit: ");
            double fahrenheit = sc.nextDouble();
            double celsius = (fahrenheit - 32) * 5 / 9;
            System.out.printf("Temperature in Celsius: %.2f\n", celsius);
        } else {
            System.out.println("Invalid choice");
        }

        sc.close();
    }
}
