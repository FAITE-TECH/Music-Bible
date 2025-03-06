export const GetResponse = async (req, res) => {
  try {

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const response = await fetch('http://chatbot-alb-822659136.ap-south-1.elb.amazonaws.com/ask', {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ question }),  
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'An error occurred' });
  }
};
