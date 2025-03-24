public class Sum_Even_Numbers {
    public static void main(String[] args) {
        int num = 2, sum = 0;

        while (num <= 10) {
            sum += num;
            num += 2;
        }

        System.out.println("Sum of even numbers from 1 to 10: " + sum);
    }
}