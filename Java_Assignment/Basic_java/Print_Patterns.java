import java.util.Scanner;

public class Print_Patterns {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the pattern you want to print (square, triangle) : ");
        String shape = sc.next().toLowerCase();
        if (shape.equals("triangle")) {
            System.out.print("Enter the base length of the triangle : ");
            int base_length = sc.nextInt();
            System.out.println();
            for (int i = 1; i <= base_length; i++) {
                for (int j = 1; j <= base_length - i; j++) {
                    System.out.print(" ");
                }
                for (int j = 1; j <= i; j++) {
                    System.out.print(". ");
                }
                System.out.println();
            }
        } else if (shape.equals("square")) {
            System.out.print("Enter the side length of the square : ");
            int side_length = sc.nextInt();
            for (int i = 1; i <= side_length; i++) {
                if (i == 1 || i == side_length) {
                    for (int j = 1; j <= side_length; j++) {
                        System.out.print(". ");
                    }
                } else {
                    System.out.print(". ");
                    for (int j = 2; j <= side_length-1; j++) {
                        System.out.print("  ");
                    }
                    System.out.print(". ");
                }
                System.out.println();
            }
        } else {
            System.out.println("Invalid Shape");
        }
        sc.close();
    }
}
