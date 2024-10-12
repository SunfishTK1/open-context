import PyPDF2

with open('/Users/utkanuygur/Desktop/open-context/server/pinecone/probability.pdf', 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    lst = []
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        a = repr(page.extract_text()).split('\n\n')
        lst.append(a)
    lst = [item for ]
        