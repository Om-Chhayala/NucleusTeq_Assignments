import java.util.Scanner;

public class Calculate_Area {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        System.out.print("Enter shape (circle, rectangle, triangle): ");
        String shape = sc.next().toLowerCase();

        if (shape.equals("circle")) {
            System.out.print("Enter radius: ");
            double radius = sc.nextDouble();
            System.out.printf("Area: %.2f\n", Math.PI * radius * radius);
        } else if (shape.equals("rectangle")) {
            System.out.print("Enter length and width: ");
            double length = sc.nextDouble(), width = sc.nextDouble();
            System.out.printf("Area: %.2f\n", length * width);
        } else if (shape.equals("triangle")) {
            System.out.print("Choose method (Enter 1 for Base-Height and 2 Heron's Formula): ");
            int method = sc.nextInt();
            if (method == 1) {
                System.out.print("Enter base and height: ");
                double base = sc.nextDouble(), height = sc.nextDouble();
                System.out.printf("Area: %.2f\n", 0.5 * base * height);
            } else if (method == 2) {
                System.out.print("Enter three sides: ");
                double a = sc.nextDouble(), b = sc.nextDouble(), c = sc.nextDouble();
                double s = (a + b + c) / 2;
                double area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
                System.out.printf("Area: %.2f\n", area);
            } else {
                System.out.println("Invalid method");
            }
        } else {
            System.out.println("Invalid shape");
        }
        
        sc.close();
    }
}
