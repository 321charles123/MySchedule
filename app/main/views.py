from flask import render_template, redirect, url_for, request, jsonify
from flask.ext.login import current_user
from . import main
from .forms import TasksForm
from ..models import Tasks
from .. import db
from datetime import datetime

@main.route('/', methods=['GET','POST'])
def index():
    if current_user.is_authenticated:
	form = TasksForm()
	if form.validate_on_submit():
	    print form.Date.data
	    Date = datetime.strptime(form.Date.data,'%Y-%m-%d').date()
	    tasks = Tasks.query.filter_by(date=Date, user_id=current_user.id).all()
	    old_tasks = []
	    new_tasks = []
	    for i in range(5):
		n = str(i+1)
		new_tasks.append(form['Task'+n].data)
	    print new_tasks
		
	    for old_task in tasks:
		old_tasks.append(old_task.task)
	    print old_tasks

	    for task in new_tasks:
		if task not in old_tasks: 
	    	    print task 
		    task = Tasks(task=task,
				 user_id=current_user.id,
				 date=Date)
		    db.session.add(task)
		

	    for task in old_tasks:
		if task not in new_tasks:
		    print task
		    for old_task in tasks:
			if task == old_task.task:
		    	    db.session.delete(old_task)
			 
	    db.session.commit() 

	    tasks = Tasks.query.filter_by(date=Date, user_id=current_user.id).all() 
	    for task in tasks:
		if not task.task:
			db.session.delete(task)
	    db.session.commit()

	return render_template('index.html', form=form)
    return redirect( url_for('auth.login') )

@main.route('/tasks')
def get_tasks():
    date = request.args.get('DATE', 0, type=str)
    tasks = Tasks.query.filter_by(date=date, user_id=current_user.id).all()
    TASKS = { u'Task1':'', u'Task2':'', u'Task3':'', u'Task4':'', u'Task5':''}
    i = 0;
    for task in tasks:
	n = str(i+1)
	task_label = 'Task' + n
	checkbox_label = 'checkbox' + n
	TASKS[task_label] = task.task + "+" + str(task.confirmed)
	i = i + 1
    print TASKS
    return jsonify(TASKS)
	
@main.route('/checked')
def checked():
    date = request.args.get('DATE', 0, type=str)
    task_content = request.args.get('TASK', 0, type=str).lstrip(' ') #delete the first letter
    task = Tasks.query.filter_by(date=date, task=task_content, user_id=current_user.id).first()
    task.confirmed = True
    db.session.add(task)
    db.session.commit()
    info = { u'info': 'ok'}
    return jsonify(info)
    
@main.route('/unchecked')
def unchecked():
    date = request.args.get('DATE', 0, type=str)
    task_content = request.args.get('TASK', 0, type=str).lstrip(' ')
    task = Tasks.query.filter_by(date=date, task=task_content, user_id=current_user.id).first()
    task.confirmed = False
    db.session.add(task)
    db.session.commit()
    info = { u'info': 'ok'}
    return jsonify(info)
    




