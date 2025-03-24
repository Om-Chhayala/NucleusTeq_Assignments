class MultithreadingDemo1 extends Thread {
    public void run() {
        try {
            System.out.println("Thread " + Thread.currentThread().threadId() + " is running by extending Thread class");
        } catch (Exception e) {
            System.out.println("Exception is caught");
        }
    }
}

class MultithreadingDemo2 implements Runnable {
    public void run() {
        try {
            System.out.println("Thread " + Thread.currentThread().threadId() + " is running by using Runnable interface");
        } catch (Exception e) {
            System.out.println("Exception is caught");
        }
    }
}

public class Multithread {
    public static void main(String[] args) {
        int n = 2;

        for (int i = 0; i < n; i++) {
            MultithreadingDemo1 thread1 = new MultithreadingDemo1();
            thread1.start();
        }

        for (int i = 0; i < n; i++) {
            Thread thread2 = new Thread(new MultithreadingDemo2());
            thread2.start();
        }
    }
}
