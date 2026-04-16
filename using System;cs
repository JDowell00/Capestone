using System;
using System.Collections.Generic;
using System.Windows.Forms;


namespace CyberLearnGUI
{
    public partial class Form1 : Form
    {
        class Question
        {
            public string Text;
            public string CorrectAnswer;
            public string[] Options;

            public Question(string text, string correctAnswer, string[] options)
            {
                Text = text;
                CorrectAnswer = correctAnswer;
                Options = options;
            }
        }

        List<Question> questions = new List<Question>();
        int currentQuestion = 0;
        int score = 0;

        public Form1()
        {
            InitializeComponent();
            LoadQuestions();
            DisplayQuestion();
        }

        void LoadQuestions()
        {
            questions.Add(new Question(
                "What does CIA stand for in cybersecurity?",
                "Confidentiality, Integrity, Availability",
                new string[] {
                    "Central Intelligence Agency",
                    "Confidentiality, Integrity, Availability",
                    "Cyber Intelligence Access",
                    "Control, Inspect, Authorize"
                }));

            questions.Add(new Question(
                "What is phishing primarily used to steal?",
                "Credentials",
                new string[] {
                    "Hardware",
                    "Bandwidth",
                    "Credentials",
                    "Firewalls"
                }));

            questions.Add(new Question(
                "What does hashing ensure?",
                "Data Integrity",
                new string[] {
                    "Encryption",
                    "Data Integrity",
                    "Faster Speed",
                    "Network Access"
                }));
        }

        void DisplayQuestion()
        {
            if (currentQuestion >= questions.Count)
            {
                MessageBox.Show($"Quiz Finished! Final Score: {score}/{questions.Count}");
                Application.Exit();
                return;
            }

            var q = questions[currentQuestion];
            lblQuestion.Text = q.Text;

            btnA.Text = q.Options[0];
            btnB.Text = q.Options[1];
            btnC.Text = q.Options[2];
            btnD.Text = q.Options[3];

            lblScore.Text = $"Score: {score}";
        }

        void CheckAnswer(string selected)
        {
            if (selected == questions[currentQuestion].CorrectAnswer)
            {
                score++;
            }

            currentQuestion++;
            DisplayQuestion();
        }

        private void btnA_Click(object sender, EventArgs e)
        {
            CheckAnswer(btnA.Text);
        }

        private void btnB_Click(object sender, EventArgs e)
        {
            CheckAnswer(btnB.Text);
        }

        private void btnC_Click(object sender, EventArgs e)
        {
            CheckAnswer(btnC.Text);
        }

        private void btnD_Click(object sender, EventArgs e)
        {
            CheckAnswer(btnD.Text);
        }
    }
}
