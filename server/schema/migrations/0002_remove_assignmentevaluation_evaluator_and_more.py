# Generated by Django 4.2 on 2025-02-18 11:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('schema', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='assignmentevaluation',
            name='evaluator',
        ),
        migrations.RemoveField(
            model_name='employee',
            name='employee_type',
        ),
        migrations.AddField(
            model_name='assignment',
            name='created_by',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='created_assignments', to='schema.employee'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='assignment',
            name='submission_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='assignment',
            name='submission_text',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='employee',
            name='role',
            field=models.CharField(choices=[('ADMIN', 'Admin'), ('INTERN', 'Intern')], default=1, max_length=20),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='assignment',
            name='assigned_to',
            field=models.ManyToManyField(related_name='assigned_assignments', to='schema.employee'),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='status',
            field=models.CharField(choices=[('PENDING', 'Pending'), ('IN_PROGRESS', 'In Progress'), ('SUBMITTED', 'Submitted'), ('EVALUATED', 'Evaluated')], default='PENDING', max_length=20),
        ),
    ]
