from flask.ext.wtf import Form
from wtforms import StringField, SubmitField, HiddenField
from wtforms.validators import Required


class TasksForm(Form):
    Task1 = StringField('Task 1:', validators=[])
    Task2 = StringField('Task 2:', validators=[])
    Task3 = StringField('Task 3:', validators=[])
    Task4 = StringField('Task 4:', validators=[])
    Task5 = StringField('Task 5:', validators=[])
    Date = HiddenField()
